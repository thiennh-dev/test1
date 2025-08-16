// Expressive Code
// ec.config.mjs
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

export default {
  themes: ['github-light', 'github-dark'],
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => `[data-theme="${theme.name.split('-')[1]}"]`,
  defaultProps: {
    wrap: true,
    collapseStyle: 'collapsible-auto',
    overridesByLang: {
      'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh': {
        showLineNumbers: false,
      },
    },
  },
  styleOverrides: {
    codeFontSize: '0.75rem',
    borderColor: 'var(--border)',
    codeFontFamily: 'var(--font-mono)',
    codeBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
    frames: {
      editorActiveTabForeground: 'var(--muted-foreground)',
      editorActiveTabBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'transparent',
      editorTabBorderRadius: '0',
      editorTabBarBackground: 'transparent',
      editorTabBarBorderBottomColor: 'transparent',
      frameBoxShadowCssValue: 'none',
      terminalBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
      terminalTitlebarBackground: 'transparent',
      terminalTitlebarBorderBottomColor: 'transparent',
      terminalTitlebarForeground: 'var(--muted-foreground)',
    },
    lineNumbers: {
      foreground: 'var(--muted-foreground)',
    },
    uiFontFamily: 'var(--font-sans)',
  },
}
