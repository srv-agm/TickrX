import Endpoint from "@/common/endpoint";
import { APICall } from "@/services";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

type ErrorResponse = {
  message: string;
};

export type SignUpBodyType = {
  name: string;
  email: string;
  phone: string;
  temp_password: string;
  role: "user";
  gender: "male" | "female";
};

export function useSignUp(
  onError: (data: ErrorResponse) => void,
  onSuccess: (data: unknown) => void,
) {
  const url = process.env.NEXT_PUBLIC_AUTH_DOMAIN + Endpoint.SIGN_UP;
  return useMutation(APICall({ url, method: "POST" }), { onError, onSuccess });
}

/** RESPONSE FROM API
{
    "message": "User created successfully",
    "user": {
        "CodeDeliveryDetails": {
            "AttributeName": "email",
            "DeliveryMedium": "EMAIL",
            "Destination": "t***@m***"
        },
        "ResponseMetadata": {
            "HTTPHeaders": {
                "connection": "keep-alive",
                "content-length": "171",
                "content-type": "application/x-amz-json-1.1",
                "date": "Fri, 18 Oct 2024 06:22:06 GMT",
                "x-amzn-requestid": "3862caf7-875b-4fed-a68e-1f71b1a7153a"
            },
            "HTTPStatusCode": 200,
            "RequestId": "3862caf7-875b-4fed-a68e-1f71b1a7153a",
            "RetryAttempts": 0
        },
        "UserConfirmed": false,
        "UserSub": "d8c13360-2041-70cd-66d4-48fd5f4bd821"
    }
}
 */
