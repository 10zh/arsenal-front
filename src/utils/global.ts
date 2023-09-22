import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const getEnableByType = (enable: string) => {
  console.log('type:', enable);
  if (enable === '1') {
    return t('global.enable');
  }
  return t('global.disable');
};

export default getEnableByType;
