export default function getCookie(targetCookie: string) {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  let cookieValue;
  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=');
    if (name === targetCookie) {
      cookieValue = decodeURIComponent(value);
    }
  });
  return cookieValue;
}
