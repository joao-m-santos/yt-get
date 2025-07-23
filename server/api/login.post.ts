export default defineEventHandler(async (event) => {
  const { password } = await readBody(event);

  console.log('[password]', password, process.env.PASSWORD);

  if (password === process.env.PASSWORD) {
    // set the user session in the cookie
    console.log('login success');
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
