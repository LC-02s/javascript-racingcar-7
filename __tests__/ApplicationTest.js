import App from '../src/App.js';
import { MissionUtils } from '@woowacourse/mission-utils';

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();

  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickNumberInRange = jest.fn();

  numbers.reduce((acc, number) => {
    return acc.mockReturnValueOnce(number);
  }, MissionUtils.Random.pickNumberInRange);
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

describe('자동차 경주', () => {
  const ERROR_PREFIX = '[ERROR]';

  test('기능 통합 테스트', async () => {
    // given
    const MOVING_FORWARD = 4;
    const STOP = 3;
    const inputs = ['pobi,woni', '1'];
    const logs = ['pobi : -', 'woni : ', '최종 우승자 : pobi'];
    const logSpy = getLogSpy();

    mockQuestions(inputs);
    mockRandoms([MOVING_FORWARD, STOP]);

    // when
    const app = new App();
    await app.run();

    // then
    logs.forEach((log) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
    });
  });

  test('이름 입력 예외 테스트', async () => {
    // given
    const inputs = ['pobi,javaji', 'pobi', 'pobi,pobi,java', ',,'];
    mockQuestions(inputs);

    // when
    const app = new App();

    // then
    for (const _ of inputs) {
      await expect(app.run()).rejects.toThrow(ERROR_PREFIX);
    }
  });

  test('횟수 입력 예외 테스트', async () => {
    // given
    const nameInput = 'pobi,java';
    const inputs = ['-2', '2.31', 'pobi', '0'];
    mockQuestions(inputs.flatMap((input) => [nameInput, input]));

    for (const _ of inputs) {
      // when
      const app = new App();

      // then
      await expect(app.run()).rejects.toThrow(ERROR_PREFIX);
    }
  });
});
