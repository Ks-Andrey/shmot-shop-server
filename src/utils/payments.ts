import { accessSecret, deliveryPrice, password, refreshSecret, userName } from "..";
import { UUID } from "../types";
import axios from 'axios';

export async function makePayment(amount: number, returnUrl: string, orderNumber: UUID) {
    try {
        const response = await axios.post(
            'https://abby.rbsuat.com/payment/rest/register.do',
            new URLSearchParams({
                amount: `${(amount + +deliveryPrice)  * 100}`,
                currency: '933',
                userName,
                orderNumber,
                password,
                returnUrl: returnUrl,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error('Error making payment request:', error.response?.data || error.message);
    }
}

