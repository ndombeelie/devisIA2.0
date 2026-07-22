import React, { useState, useRef, useEffect } from 'react';

export default function AIAssistant({ company }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Bonjour ! Je suis votre assistant IA DevisAI. Je peux vous aider à :

📄 **Créer des devis** - "Fais-moi un devis pour la création d'un site web"
📝 **Rédiger des descriptions** - "Décris ce produit de façon professionnelle"
📧 **Rédiger des emails** - "Écris un email de relance pour un devis en attente"
💰 **Conseils tarifaires** - "Quel prix pour un service de consultation ?"
✅ **Corriger des textes** - "Corrige ce texte"

Comment puis-je vous aider aujourd'hui ?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_key') || '');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Si pas de clé API, on simule une réponse
      if (!apiKey) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let response = '';
        const lowerInput = userMessage.toLowerCase();
        
        if (lowerInput.includes('devis') || lowerInput.includes('quote')) {
          response = `Pour créer un devis, voici ce que je vous suggère :

1. Allez dans **Devis → Nouveau devis**
2. Sélectionnez un client existant ou créez-en un
3. Ajoutez vos produits/services
4. Les calculs sont automatiques (TVA, remises, total)
5. Exportez en PDF quand vous êtes satisfait

💡 **Astuce :** Vous pouvez personnaliser la numérotation dans Paramètres.

Voulez-vous que je vous aide à rédiger une description pour un produit ?`;
        } else if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('combien')) {
          response = `Voici quelques conseils pour déterminer vos prix :

📊 **Analysez vos coûts** :
- Coût de revient (matériaux, temps)
- Charges fixes et variables
- Marge souhaitée (généralement 20-40%)

💡 **Stratégies de tarification** :
- **Prix de pénétration** : Prix bas pour gagner des parts de marché
- **Prix premium** : Justifiez par la qualité et le service
- **Tarification horaire** : Idéal pour les services

Quel type de produit ou service souhaitez-vous tarifer ?`;
        } else if (lowerInput.includes('email') || lowerInput.includes('relance')) {
          response = `Voici un exemple d'email de relance :

---

**Objet : Suivi de votre demande de devis**

Madame, Monsieur,

Nous nous permettons de revenir vers vous concernant le devis que nous vous avons envoyé le [date].

Nous restons à votre disposition pour toute modification ou clarification.

Dans l'attente de votre retour, nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées.

${company.name}

---
        Voulez-vous que je personnalise cet email ?`;
        } else {
          response = `Je comprends votre demande. Pour mieux vous aider, je peux :

1. 📄 Vous guider dans la création de devis
2. 📝 Rédiger des descriptions professionnelles
3. 📧 Préparer des emails commerciaux
4. 💡 Donner des conseils sur vos tarifs

Pour activer toutes les fonctionnalités IA avancées, vous pouvez configurer votre clé API OpenRouter dans Paramètres.

Que souhaitez-vous faire ?`;
        }
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } else {
        // Appel réel à l'API OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://devisai-desktop.app',
            'X-Title': 'DevisAI Desktop'
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Tu es un assistant IA professionnel pour un logiciel de création de devis. Tu aides les utilisateurs à créer des devis, rédiger des descriptions, gérer leur activité commerciale. Tu réponds de manière professionnelle et utile en français. L'entreprise s'appelle "${company.name}".`
              },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage }
            ]
          })
        });

        const data = await response.json();
        if (data.choices?.[0]?.message?.content) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.choices[0].message.content 
          }]);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Une erreur est survenue. Veuillez réessayer.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between mb-2">
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>🤖 Assistant IA</h2>
        {!apiKey && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              const key = prompt('Entrez votre clé API OpenRouter:');
              if (key) {
                setApiKey(key);
                localStorage.setItem('openrouter_key', key);
              }
            }}
          >
            ⚙️ Configurer API
          </button>
        )}
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '16px'
        }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--background)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)'
              }}>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                background: 'var(--background)'
              }}>
                <div className="text-muted">En train d'écrire...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            className="form-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !input.trim()}
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
