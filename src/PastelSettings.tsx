import {useEffect, useState} from 'react';
import {t, useLanguage} from './lib/i18n';

const storageKey = 'crm-pastel-hue';
const defaultHue = 265;
const presets = [
  {label: '라벤더', hue: 265},
  {label: '복숭아', hue: 20},
  {label: '민트', hue: 155},
  {label: '하늘', hue: 207},
] as const;

function readHue() {
  try {
    const saved = localStorage.getItem(storageKey);
    const hue = Number(saved);
    if (saved !== null && Number.isInteger(hue) && hue >= 0 && hue <= 359) return hue;
  } catch {
    // Color selection is still available for this visit.
  }
  return defaultHue;
}

export default function PastelSettings() {
  useLanguage();
  const [hue, setHue] = useState(readHue);

  useEffect(() => {
    document.body.style.setProperty('--pastel-hue', String(hue));
    try {
      localStorage.setItem(storageKey, String(hue));
    } catch {
      // The preview works without browser storage.
    }
  }, [hue]);

  return <details className="pastel-settings">
    <summary>{t('기본 테마 색상')}</summary>
    <div className="pastel-presets">
      {presets.map(preset => <button key={preset.hue} type="button"
        aria-pressed={hue === preset.hue} onClick={() => setHue(preset.hue)}>
        {t(preset.label)}
      </button>)}
    </div>
    <label>
      {t('색상 직접 조절')}
      <input type="range" min={0} max={359} value={hue} onChange={event => setHue(event.currentTarget.valueAsNumber)} />
    </label>
    <button type="button" onClick={() => setHue(defaultHue)}>{t('기본 색상으로')}</button>
  </details>;
}
