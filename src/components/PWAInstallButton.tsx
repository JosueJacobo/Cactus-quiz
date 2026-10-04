import React, { useState } from 'react';
import { Download, Smartphone, X, ExternalLink, Copy, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText(
      'git clone https://github.com/JosueJacobo/Cactus-quiz.git && cd Cactus-quiz && npm install && npm run apk:build'
    );
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <>
      {isInstallable ? (
        <button
          type="button"
          onClick={install}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-emerald-800 transition-colors whitespace-nowrap"
          title="Instalar como aplicación nativa sin barra de enlace"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-1 rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100 whitespace-nowrap"
          title="Obtener APK Nativo Android o instalar sin barra de direcciones"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">App / APK</span>
        </button>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-700 font-semibold">
                  com.josuejacobo.cactaceasquiz
                </span>
                <h3 className="text-base font-bold text-stone-900">
                  App Nativa Android (APK) y Modo Sin Enlace
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
                <p className="font-semibold text-emerald-950">
                  Opción 1: Descargar el archivo <code>.apk</code> en 10 segundos (PWABuilder)
                </p>
                <p className="text-emerald-900">
                  Genera el paquete <code>.apk</code> firmado listo para instalar en Android sin barra de direcciones:
                </p>
                <a
                  href="https://www.pwabuilder.com/reportcard?site=https://josuejacobo.github.io/Cactus-quiz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors"
                >
                  <span>Generar APK directo (Package for store → Android)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 space-y-1.5">
                <p className="font-semibold text-stone-900">
                  Opción 2: Proyecto Nativo Android (Capacitor) incluido en tu GitHub
                </p>
                <p className="text-stone-600">
                  La carpeta nativa <code>/android</code> ya está creada en tu repositorio con paquete <code>com.josuejacobo.cactaceasquiz</code> y tema <code>NoActionBar</code> (pantalla completa nativa):
                </p>
                <div className="flex items-center justify-between gap-2 bg-stone-900 text-stone-100 p-2 rounded font-mono text-[11px]">
                  <span className="truncate">npm run apk:build</span>
                  <button
                    type="button"
                    onClick={handleCopyCmd}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-700 text-white hover:bg-stone-600 shrink-0"
                  >
                    {copiedCmd ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {isIOS ? (
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <p className="font-semibold text-stone-900">En iPhone / iPad (sin barra de Safari):</p>
                  <p className="mt-0.5 text-stone-600">
                    Toca <strong>Compartir</strong> en Safari y elige <strong>Agregar a pantalla de inicio</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                  <p className="font-semibold text-stone-900">Instalación directa desde Chrome Android:</p>
                  <p className="mt-0.5 text-stone-600">
                    Abre el menú <strong>⋮</strong> de Chrome y toca <strong>Instalar aplicación</strong>. Se instala con su icono en tu cajón de apps y abre a pantalla completa sin mostrar ningún enlace.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full rounded-lg bg-stone-900 py-2 text-xs font-medium text-white hover:bg-stone-800"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
