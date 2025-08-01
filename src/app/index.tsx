import { Redirect } from "expo-router";
console.log('App iniciado');

export default function Index() {
  return <Redirect href="/(public)/login" />;
}
