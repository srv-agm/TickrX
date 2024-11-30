import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { QueryFunctionContext } from "react-query";

// TYPES
type Method = "GET" | "POST" | "PUT" | "DELETE";
type APICallType = {
  method: Method;
  url: string;
};
//
const headers = { "Content-Type": "application/json" };
const API_Instance = axios.create({ headers });

// // Deprecated
export function APICall(q: APICallType) {
  return async (params: { query?: Record<string, string>; body?: unknown }) => {
    try {
      switch (q.method) {
        case "GET": {
          return await API_Instance.get(q.url, {
            params: params.query,
          });
        }
        case "POST": {
          return await API_Instance.post(q.url, params.body, {
            params: params.query,
          });
        }
        case "PUT": {
          return await API_Instance.put(q.url, params.body, {
            params: params.query,
          });
        }
        case "DELETE": {
          return await API_Instance.delete(q.url, {
            params: params.query,
          });
        }
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        switch (error.status) {
          case 401:
          // console.log("401");
          // sessionStorage.clear();
          // window.location.href = "/";
          // break;
          default:
            throw new Error(
              error.response?.data?.error ?? "Something went wrong",
            );
        }
      }
      throw new Error("Something went wrong");
    }
  };
}

async function ApiCall<D = void>({
  options,
  signal,
}: {
  options: AxiosRequestConfig;
  signal?: AbortSignal | undefined;
}): Promise<D> {
  const config: AxiosRequestConfig = {
    ...options,
    signal: signal,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      switch (error.status) {
        case 401:
        // console.log("401");
        // sessionStorage.clear();
        // window.location.href = "/";
        // break;
        default:
          throw new Error(
            error.response?.data?.error ?? "Something went wrong",
          );
      }
    }
    throw new Error("Something went wrong");
  }
}

export function queryFunction(q: QueryFunctionContext) {
  // @ts-expect-error unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { options }] = q.queryKey;
  return ApiCall({ options, signal: q.signal });
}

export async function mutationFunction(options: AxiosRequestConfig) {
  return ApiCall({ options });
}

// Generic function to fetch data using useQuery
// Deprecated
export async function fetchData(q: QueryFunctionContext) {
  const [_key, { options }] = q.queryKey;
  console.log("options:", options);
  const config: AxiosRequestConfig = {
    ...options,
    signal: q.signal,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      switch (error.status) {
        case 401:
        // console.log("401");
        // sessionStorage.clear();
        // window.location.href = "/";
        // break;
        default:
          throw new Error(
            error.response?.data?.error ?? "Something went wrong",
          );
      }
    }
    throw new Error("Something went wrong");
  }
}
