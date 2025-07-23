export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);

  if (password === process.env.PASSWORD) {
    // set the user session in the cookie
    await setUserSession(event, {
      user: {},
    });
    return {};
  }
  throw createError({
    statusCode: 401,
    statusMessage: 'wrong password',
  });
});
