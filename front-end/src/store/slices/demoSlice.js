import preview from "../../img/demo/preview.jpg";
import incorrectVideo from "../../videos/incorrect.mp4";

import { createSlice } from "@reduxjs/toolkit";

const demoState = {
  games: [
    {
      name: "Пробная игра",
      description:
        "Попробуйте себя в роли помощника профессора Золтана, вам по силам провести целый день в его театре, познакомиться с несколькими инструментами решения задач?",
      preview,

      stages: [
        {
          id: 1,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-5236.MP4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250507%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250507T223829Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=3a0d44e8323988998d0527c185d1a4865d017af8d175c2d4ebd41cfce1dc33a2",
          description: `Carus doctor Zoltan.
              Scribo ad te, dum adhuc sanae mentis sim, sed non diu.
              Tantum potes adiuva me. Quaeso! Nolo ad alium
              mundum iam ire! Est quodammodo fictus. Ibi somnum,
              cibum, aliasque voluptates non curo. Ibi temporis lente.
              Est ac si participem taediosum theatrum. Omnia videre
              extrinsecus videor, video quomodo insaniat animus, sed nec
              manum nec pedem movere possum. Quaeso, Doctor!
              Adiuva me! Nolo! Nolo!...
              `,
          tips: [
            "Попробуйте перевести текст через онлайн переводчик, он автоматически определит язык ",
            "Попробуйте описать симптомы болезни поисковику в интернете, основываясь на письме",
            "Название болезни: синдром деперсонализации-дереализации",
          ],
          answer: "синдром деперсонализации-дереализации",
          incorrect: incorrectVideo,
          format: "Введите ответ в формате «синдром***-***»",
        },
        {
          id: 2,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-5258.MP4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250507%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250507T224229Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=104cc807a74c14064ea6a569f1f0413f39fa9bb00aab26d051056785deb4bd22",
          description: "«Введите ответ в формате *1234*»",
          tips: [
            "Пароль состоит из 4 цифр, цифры спрятаны в каждом логическом фрагменте видео",
            "Обратите внимание на пальцы, ключи, стихотворение и текст на двери  3 подсказка 1 цифра 4 (количество дел, которые должен сделать Джордж) 2 цифра 4 (ключи, которые остались висеть у ключника образуют силуэт цифры 4) 3 цифра 1 (первые буквы строчек стихотворения) 4 цифра 6 (Сонет 6 Уильяма Шекспира)",
          ],
          answer: "4416",
          incorrect:
            "https://media.zoltansgametma.ru/videos/2046130786-5262.MP4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250507%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250507T224334Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=7d2e7ab5c5306a505390e1471c953034113468f4c3119497289a5d1a99db8e91",
        },
        {
          id: 3,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-5276.MP4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250507%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250507T224626Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=37b8028ed42367d1bc4e8130618a69f90955cf687b337a2aa2886dcf42ed1fde",
          description: "«Введите ответ в формате *** ***»",
          tips: [
            "Отсканируйте QR-код в глазах Примы и бродите по глубине сознания примадонны в поисках Джорджа",
            "Во всех кусках воспоминаний спрятан предмет для перехода на следующий этап",
          ],
          answer: "комната мелка",
          incorrect: "",
        },
        {
          id: 4,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-5290.MP4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250508%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250508T110441Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e3ab8ce43ed137d1c88a1dfad0cb23bceb921fa4fc09ca288c109b43920929d0",
          description: "Финал",
          tips: [],
          answer: "",
          incorrect: "",
        },
      ],
    },
  ],
  isOpen: false,
};
const demoSlice = createSlice({
  name: "demo",
  initialState: demoState,
  reducers: {
    setOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});
export const { setOpen } = demoSlice.actions;

export default demoSlice.reducer;
