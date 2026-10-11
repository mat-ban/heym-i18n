# Denetim Günlüğü

Heym, güvenlikle ilgili her eylem için bir denetim satırı yazar: kimin yaptığı, ne üzerinde yaptığı ve başarılı olup olmadığı. Satırlar, istek erişim günlüğünün yanı sıra `winston.audit` logger'ı aracılığıyla backend'in standart çıktısına gider ve **Logs** sekmesinden veya `docker logs` ile okunabilir.

Denetim günlüğü **her zaman açıktır**. Etkinleştirilecek bir şey ve ayarlanacak bir ortam değişkeni yoktur.

## Satır Formatı

Bir eylem tam olarak bir kendi kendine yeten satır üretir:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Her satır şu alanları taşır:

| Alan | Açıklama |
|-------|-------------|
| `action` | Ne olduğu, `resource.verb` biçiminde — aşağıdaki tabloya bakın. |
| `outcome` | `success`, `failure` veya `denied`. |
| `actor_id` | Eylemi gerçekleştiren kullanıcının UUID'si. Yalnızca kimse kimlik doğrulaması yapmadığında bulunmaz. |
| `actor_email` | Bu kullanıcının e-posta adresi. Başarısız bir oturum açmada bu, doğrulanmış bir hesap değil, denenmiş olan adrestir. |
| `target` | Üzerinde işlem yapılan nesne, `type:uuid` biçiminde. |
| `target_name` | Bu nesnenin insan tarafından okunabilir adı; boşluk içerdiğinde tırnak içine alınır. |

Ardından eyleme özgü alanlar gelir — örneğin `credential_type`, `imported`, `grantee_email`, `team_name`. Boşluk, tırnak veya `=` içeren değerler tırnak içine alınır; 256 karakterden uzun değerler `...(truncated)` işaretiyle kesilir.

## Günlüğü Okuma

Denetim logger'ı, istek logger'ının bir alt öğesidir; böylece her ikisi de aynı akışa ulaşırken ayrılabilir kalır:

```bash
# Yalnızca denetim satırları, erişim günlüğü gürültüsü olmadan
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Bir kullanıcının yaptığı her şey
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Başarısız oturum açmalar ve reddedilen erişimler
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Bir credential'a dokunan her şey
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Uygulamada **Logs** sekmesi aynı container çıktısını okur. `DOCKER_LOGS_ENABLED` ve `DOCKER_LOGS_ALLOWED_EMAILS` izin listesi tarafından denetlenir.

## Neler Günlüğe Kaydedilir

Her durum değişikliği günlüğe kaydedilir. Okumalar yalnızca okumanın kendisinin hassas eylem olduğu durumlarda günlüğe kaydedilir — bir workflow'un çalıştırma geçmişini görüntüleme, bir credential'ı açma, bir dosya indirme. Sıradan liste ve ayrıntı okumaları denetlenmez; erişim günlüğü zaten bir isteğin gerçekleştiğini kaydeder ve her `GET` isteğini denetlemek önemli olan satırları gömer.

### Kimlik Doğrulama

| Eylem | Notlar |
|--------|-------|
| `auth.register` | Kayıt devre dışı bırakıldığında veya parola ile oturum açma kapalı olduğunda (`reason=password_login_disabled`) `outcome=denied`, e-posta alınmış olduğunda `failure`. |
| `auth.login` | `outcome=failure`, denenmiş olan adresi ve e-postanın bilinmediğini mi yoksa parolanın mı yanlış olduğunu kaydeder. |
| `auth.logout` | Aktör, refresh cookie'den çözümlenir; bu nedenle cookie olmadan yapılan bir oturum kapatma kimlik bilgisi olmadan günlüğe kaydedilir. |
| `auth.token_refresh` | `reason=refresh_token_replayed_or_revoked` ile `outcome=denied` — uyarı verilmesi gereken bir token hırsızlığı sinyali. |
| `auth.password_change` | Mevcut parola yanlış olduğunda `outcome=failure`. |
| `auth.sso_login` | Tek oturum açma. `outcome=failure`, sağlayıcı yanıtının reddedilme nedenini taşır; `denied` ise `email_not_verified`, `domain_not_allowed` veya `provisioning_disabled` taşır. |
| `sso_settings.update` | Bir yönetici [SSO](./sso.md) yapılandırmasını değiştirdi. `enabled` ve `password_login_disabled` kaydeder, client secret'ı asla. |
| `sso_settings.test` | Bir yönetici SSO bağlantı testini çalıştırdı. |

### Workflow'lar

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view`, bir işbirlikçi başkasının çalıştırma geçmişini okuduğunda `owned=false` kaydeder. `workflow.delete`, bir işbirlikçi silmeye çalıştığında `reason=not_owner` ile `outcome=denied` kaydeder.

### Credential'lar

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` denetlenir çünkü bir credential'ı açmak onun şifresini çözer. Bir isabetsizlik `outcome=denied` kaydeder; bir credential-id numaralandırma girişimi tam olarak böyle görünür.
### Diğer kaynaklar

| Kaynak | Eylemler |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vector stores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerts | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Data tables | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

Toplu işlemler, satır başına değil, istek başına bir kez ve bir sayımla kaydedilir. 5.000 satırlık bir CSV içe aktarımı, `imported`, `rejected` ve `total` alanlarını taşıyan tek bir `data_table.import_csv` satırı üretir.

## Gizli Bilgiler Asla Kaydedilmez

Bir denetim satırı; tanımlayıcıları, adları ve sayımları kaydeder. Bir credential'ın içeriğini, bir variable'ın değerini, bir parolayı veya bir token'ı asla kaydetmez.

Bunu iki şey zorunlu kılar. Çağrı noktaları yalnızca güvenli alanları geçecek şekilde yazılmıştır ve denetim yardımcısı bir güvenlik ağı olarak redaksiyon uygular: adı `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` veya benzerini içeren her alan, satır oluşturulmadan önce `***` ile değiştirilir. Aşırı redaksiyon kasıtlıdır — yararsız bir satır, sızdırılmış bir credential'dan daha iyidir.

Bir gizli bilginin kayıtla gerçekten ilgili olduğu durumlarda yalnızca biçimi kaydedilir. Bir dosya paylaşımı `password_protected=true` kaydeder, asla parolayı kaydetmez.

## Saklama

**Denetim satırları yalnızca container'ın log çıktısı olduğu sürece yaşar.** Veritabanına yazılmazlar. Backend container'ını yeniden oluşturmak, loglarını da siler.

Yeniden dağıtımdan sonra da varlığını sürdüren bir denetim geçmişine ihtiyacınız varsa, container'ın stdout'unu kalıcı bir yere aktarın — bir log driver, bir sidecar collector veya platformunuzun log toplama çözümü — tıpkı diğer container loglarında yapacağınız gibi.

## Katkıda Bulunanlar İçin

Bir denetim satırı yaymak tek bir çağrı gerektirir:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

Yardımcı senkrondur, hiçbir veritabanına dokunmaz ve kendi hatalarını yutar; böylece bir denetim çağrısı bir isteği başarısız kılamaz veya yavaşlatamaz.

Bir tane eklerken üç kural:

1. **Eylemi snake_case içinde `resource.verb` olarak adlandırın.** `backend/tests/test_audit_log.py`, `app/api/` altındaki her `audit()` çağrısını tarar ve adı eşleşmeyen bir ad ile kapsanan bir kaynağın tüm çağrı noktalarını kaybetmesi durumunda derlemeyi başarısız kılar.

2. **Yalnızca kesinlikle mevcut olan nitelikleri okuyun.** Yardımcının `try/except` bloğu kendi gövdesini korur, ona geçirdiğiniz ifadeleri değil — `target_name=workflow.name` içindeki bir `AttributeError`, `audit()` çalışmadan önce çağrı noktasında yükseltilir ve isteği bozar. İsteğe bağlı veya tembel yüklenen nitelikleri değil, ORM sütunlarını ve yerel değişkenleri okuyun.

3. **Silme işlemini silmeden önce kaydedin.** `db.delete(row)` işleminden sonra kaydetmek istediğiniz ad ve id gitmiş olabilir. Çağrıyı bunun üstüne yerleştirin.
