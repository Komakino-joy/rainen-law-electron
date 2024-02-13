interface OwnProps {
  cookies: string;
  targetCookie: string;
}

export default function parseJSONCookie({ cookies, targetCookie }: OwnProps) {
  const encodedData = cookies
    ?.split(";")
    .find((cookie: string) => cookie.trim().startsWith(`${targetCookie}=`))
    ?.split("=")[1];

  return encodedData ? JSON.parse(decodeURIComponent(encodedData)) : "";
}
