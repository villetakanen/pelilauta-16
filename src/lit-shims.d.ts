import { CnCard, CnIcon, CnNavigationIcon } from '@11thdeg/cyan-next'
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'cn-icon': CnIcon
      'cn-card': CnCard
      'cn-navigation-icon': CnNavigationIcon
    }
  }
}
