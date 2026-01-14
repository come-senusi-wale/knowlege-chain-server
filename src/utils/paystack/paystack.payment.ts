

export class PaystackService {
    paystackSecretKey = process.env.PAYSTACK_KEY!
  
    async initTransaction(
      email: string,
      amount: number,
      userId: any,
      callback: string,
    ): Promise<any> {
      try {
        const currentDate = new Date();
        const milliseconds = currentDate.getMilliseconds();
        const response = await fetch(
          'https://api.paystack.co/transaction/initialize',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: amount * 100, // Amount in kobo (e.g., 10000 kobo = ₦100)
              email: email,
              reference: milliseconds,
              metadata: {
                userId,
                amount,
              },
              callback_url: callback,
            }),
          },
        );
  
        const data = await response.json();
  
        if (!data.status) {
          return {
            status: false,
            message: 'Unable to initialize transactions',
          };
        }
  
        return {
          status: true,
          message: 'Payment successfully initialize',
          data: {
            url: data.data.authorization_url,
            reference: data.data.reference,
          },
        };
      } catch (error) {
        console.error('Error in initializing transaction:', error);
        return {
          status: false,
          message: 'Unable to initialize transactions',
          error: error,
        };
      }
    }
  
    async verifyTransaction(reference: string): Promise<any> {
      try {
        const response = await fetch(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.paystackSecretKey}`,
            },
          },
        );
  
        const data = await response.json();
  
        if (!data.status) {
          return {
            status: false,
            message: 'Transaction reference not found',
          };
        }
  
        if (data.data.gateway_response != 'Successful') {
          return {
            status: false,
            message: 'Transaction was not completed',
          };
        }
  
        return {
          status: true,
          message: 'Transaction verified successfully',
          data: data.data.metadata,
        };
      } catch (error) {
        console.error('Error in initializing transaction:', error);
        return {
          status: false,
          message: 'Unable to verify transactions',
          error: error,
        };
      }
    }
}