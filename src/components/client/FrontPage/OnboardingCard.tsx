import { useStore } from "@nanostores/solid";
import { $uid } from "@stores/sessionStore";
import { t } from "@utils/i18n";
import type { Component } from "solid-js";

export const OnboardingCard:Component = () => {
  const uid = useStore($uid);

  return !uid() ? (
    <div>
    <cn-card
      title={t('app:onboarding.title')}
      noun="fox"
      cover="/myrrys-proprietary/public-domain/talk-to-me-by-wootha-620px.webp"
      href="/login"
      class="secondary"
    >
        <p>{t('app:onboarding.text')}</p>
      <div slot="actions" class="toolbar justify-center">
        <a href="/login" class="button cta">{t('actions:login')}</a>
      </div>
    </cn-card>
    </div>
  ) : null;
};

