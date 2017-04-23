Planart - Planetary Artillery


12.02.2017 	set up mean stack and other dependencies

16.02.2017 	got the login going.

18.02.2017 	added remember me strategy, which creates a cookie with a token when remember me checkbox at login is checked. When the site is visited again the token is consumed and logs the user in, if the login page is requested he will be redirected to the profile page.
			added online field in the user schema, which will be true if the user is logged in. It's used to allow one user to be logged in on only only one Browser/Device at a time. A message will pop up is the account is already in use.
			
24.02.2017	added static folder 'public' for express to send client side files from the server
			added jquery and socket.io for cha functionality

Notes: 
 - Please dont update the passport-local npm module, I wrote some stuff in there