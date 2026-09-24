import 'dotenv/config';
import { app } from './app';

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`DataLens BFF listening on ${port}`);
});
