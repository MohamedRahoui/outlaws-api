import prompt from 'prompt';
import prisma from '@src/tools/dbClient';
import { Prisma } from '.prisma/client';
interface IModel {
  name: string;
}
interface IReward extends IModel {
  data: Prisma.RewardCreateInput[];
  dataClass: Prisma.RewardDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  unique: 'code';
}
const models: Array<IReward> = [
  {
    name: 'Reward',
    dataClass: prisma.reward,
    unique: 'code',
    data: [
      {
        code: 'SUBSCRIPTION',
        price: 50,
      },
      {
        code: 'MUG',
        price: 100,
      },
      {
        code: 'T_SHIRT',
        price: 150,
      },
      {
        code: 'BAG',
        price: 200,
      },
    ],
  } as IReward,
];
const main = async () => {
  console.log(
    `Allowed modelNames are: ${models.map((model) => model.name).join(' ,')}`
  );
  prompt.start();
  const { modelName } = await prompt.get(['modelName']);
  if (!models.map((model) => model.name).includes(modelName as string)) {
    console.log('Model not allowed!');
    return;
  }
  const model = models.find((model) => model.name === modelName);
  if (!model) {
    console.log('Model not found, something went wrong !!');
    return;
  }
  const upsert = model.data.map((input) => {
    return model.dataClass.upsert({
      where: {
        [model.unique]: input[model.unique],
      },
      create: {
        ...input,
      },
      update: {
        ...input,
      },
    });
  });
  console.log('- Waiting for data insertion -');
  const res = await Promise.all(upsert);
  if (!res.length) {
    console.log('No line inserted nor Updated');
    return;
  }
  console.log(
    `${res.length} line(s) created or updated or simply found on the model ${modelName}`
  );
  console.log('Current data is as following:');
  console.log(res);
};
main();
