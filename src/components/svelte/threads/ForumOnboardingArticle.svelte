<script lang="ts">
import { anonymous } from '@stores/session';
import { t } from '@utils/i18n';
</script>
{#if $anonymous}
  <article class="mb-2 surface secondary">
    <h3 class="m-0 downscaled header-4 elevation-1 p-1">
      {t('threads:onboarding.title')}
    </h3>
    <div class="p-1">
      <p>
        {t('threads:onboarding.description')}
      </p>
      <p>
        <a href="/login">
          {t('actions:login')}
        </a>
      </p>
    </div>
  </article>
{/if}