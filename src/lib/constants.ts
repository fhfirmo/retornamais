
export const DEFAULT_CASHBACK_PERCENTAGE = 5; // Default 5%
export const DEFAULT_MINIMUM_REDEMPTION_VALUE = 10; // Default R$10 minimum for redemption

export const DEFAULT_WHATSAPP_TEMPLATE = `Olá {{{clientName}}}!

Obrigado por sua compra de R$${"$"}{{{purchaseValue}}} na nossa loja! 🎉

Você ganhou R$${"$"}{{{cashbackFromThisPurchase}}} de cashback nesta compra.
Seu saldo de cashback atual é R$${"$"}{{{newCurrentBalance}}}.
{{{redemptionInfo}}}

Use seu cashback na próxima compra!
Esperamos te ver em breve! 😊`;

export const APP_NAME = "Retorna+ Web";
