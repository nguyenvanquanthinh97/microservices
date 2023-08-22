export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((channelId: string, message: string, callback) => {
        callback();
      }),
  },
};
