<script lang="ts">
import { uid } from '@stores/session';
import { t } from '@utils/i18n';
</script>
{#if !$uid}
  <cn-card
    title={t('app:onboarding.title')}
    noun="fox"
    cover="/myrrys-proprietary/public-domain/talk-to-me-by-wootha-620px.webp"
    href="/login"
    class="secondary"
    description={t('app:onboarding.text')}
    >
    <div slot="actions" class="toolbar items-center">
      <a href="/login" class="button">
        {t('actions:login')}
      </a>
    </div>
  </cn-card>
{/if}