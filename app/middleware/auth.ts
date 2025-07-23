export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession();

  console.log('logged in', loggedIn.value);

  if (!loggedIn.value) {
    return navigateTo('/login');
  }
});
