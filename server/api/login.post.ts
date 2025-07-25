export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);

  if (password === process.env.PASSWORD) {
    // set the user session in the cookie
    const session = await setUserSession(event, {
      user: {
        name: 'default',
      },
    });
    return { session };
  }
  throw createError({
    statusCode: 401,
    statusMessage: 'wrong password',
  });
});
