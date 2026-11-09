import { useEffect, useState } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { env } from '../lib/env';

const WEBHOOK_PATH = '/n8n-chat/webhook/f569a6ea-1c34-4228-8b84-10e68ea6daad/chat';
const PRODUCTION_WEBHOOK_URL = `https://amarrr17.app.n8n.cloud${WEBHOOK_PATH.replace('/n8n-chat', '')}`;

export function N8nChatWidget() {
  const [configurationError, setConfigurationError] = useState(false);
  const webhookSetting = env.VITE_N8N_CHAT_WEBHOOK_URL;
  const configuredWebhookUrl = import.meta.env.DEV
    ? webhookSetting
    : webhookSetting?.startsWith('/n8n-chat')
      ? undefined
      : webhookSetting;

  useEffect(() => {
    let parsedWebhookUrl: URL;
    try {
      const defaultWebhookUrl = import.meta.env.DEV ? WEBHOOK_PATH : PRODUCTION_WEBHOOK_URL;
      parsedWebhookUrl = new URL(configuredWebhookUrl || defaultWebhookUrl, window.location.origin);
    } catch {
      setConfigurationError(true);
      return undefined;
    }
    if (!['http:', 'https:'].includes(parsedWebhookUrl.protocol)) {
      setConfigurationError(true);
      return undefined;
    }

    const chat = createChat({
      webhookUrl: parsedWebhookUrl.href,
      target: '#accesslearn-chat',
      mode: 'window',
      showWelcomeScreen: true,
      initialMessages: ['Namaste! I’m AI Sahayak. How can I help you learn today?'],
      i18n: {
        en: {
          title: 'AI Sahayak',
          subtitle: 'Ask about your lessons, reading, or study plan.',
          getStarted: 'Chat with AI Sahayak',
          inputPlaceholder: 'Ask AI Sahayak a question...',
        },
      },
    });

    return () => {
      chat.unmount?.();
      const target = document.querySelector('#accesslearn-chat');
      if (target) target.innerHTML = '';
    };
  }, [configuredWebhookUrl]);

  return <>
    <div id="accesslearn-chat" aria-label="AI Sahayak chat" />
    {configurationError && <p role="alert">AI Sahayak chat is unavailable. Check VITE_N8N_CHAT_WEBHOOK_URL.</p>}
  </>;
}
