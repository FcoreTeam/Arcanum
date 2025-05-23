import preview from "../../img/demo/preview.jpg";
import incorrectVideo from "../../videos/incorrect.mp4";

import { createSlice } from "@reduxjs/toolkit";

const demoState = {
  games: [
    {
      name: "Пробная игра",
      description:
        "Попробуйте себя в роли помощника Профессора Золтана. Вам по силам провести целый день в его театре? Первые испытания ждут вас.",
      preview,

      stages: [
        {
          id: 1,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-6578.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T161505Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=b43015b79fb2d431aa0fac3f3ca854cc430ad66c0da5266b6901de1ceaa2923a",
          description: `Текст письма: у меня, на самом то деле, нет никакой болезни. Просто мне…каждый раз трудно даётся переживать время суток после заката солнца. Я молюсь и ставлю обереги по всей квартире и даже за её пределами. Но надвигающаяся беспощадная тьма неизбежна. И у меня каждый раз ощущается дрожание рук, дрожь по всему телу и озноб, голова ужасно болит, а голос куда-то теряется. Я чувствую полную безихсодность и близость чего-то ужасного, смотрящего на меня оттуда. 
Каждый раз сон мне могут дарить только горящие лампы или свечи. Поэтому я не хожу по улицам после захода солнца, обхожу аллеи и переулки стороной даже в дневное время, ведь эта тёмная неизбежность всегда рядом. Вы можете назвать этот страх иррациональным, доктор, но что есть то есть. 
Однажды, когда в доме не было света на какое-то время, а все свечи закончились, я чуть не убил себя. Я кричал как дикое животное, впадал в кататоничнский ступор, затем снова кричал. И так до самого восхода солнца. Ибо вне его света я не могу находиться. Помогите мне научиться справляться с этой тёмной неизбежностью. Иначе однажды она убьет меня, или то, что в ней кроется…
              `,
          tips: [
            "Изучите названия , связанные с боязнью темноты",
            "Название болезни: синдром деперсонализации-дереализации",
          ],
          answer: "Никтофобия",
          incorrect:
            "https://media.zoltansgametma.ru/videos/2046130786-6582.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T163727Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=73a0a41d9d518f7bf5f401f0f78a5c1be893d37a56b90a0fd1708e7754a675aa",
          format: "введите ответ в формате *заболевание*",
        },
        {
          id: 2,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-6596.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T164348Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=9d5febafd02885e8fc989dbacc728558ced296327eb053fee7147cf72513d65e",
          description: "«Введите ответ в формате *1234*»",
          tips: [
            "Пароль состоит из 4 цифр, цифры спрятаны в каждом логическом фрагменте видео.",
            "Обратите внимание на пальцы, ключи, стихотворение и текст на двери.",
            "Первая цифра 4 (количество дел, которые должен сделать Джордж), вторая цифра 4 (ключи, которые остались висеть у ключника образуют силуэт цифры 4), третья цифра 1 (первые буквы строчек стихотворения), четвертая цифра 6 (Сонет 6 Уильяма Шекспира)",
          ],
          answer: "4416",
          incorrect:
            "https://media.zoltansgametma.ru/videos/2046130786-6600.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T164622Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c54b2a3f15d75408758679f860533cc6096e2e08a629d2d2c7edcb657d1081ea",
        },
        {
          id: 3,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-6614.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T165309Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=177831ff2ce76a84d4dc0bd1d02dbc61abe767970eeb3d132f03d3ad11b4a1d0",
          description:
            "Узнайте, куда Примадонна спрятала Джорджа. Напишите название этого места.",
          tips: [
            "Отсканируйте QR-код в глазах Примы и бродите по глубине сознания примадонны в поисках Джорджа",
            "Во всех кусках воспоминаний спрятан предмет для перехода на следующий этап",
          ],
          answer: "комнатамелка",
          incorrect: "",
        },
        {
          id: 4,
          video:
            "https://media.zoltansgametma.ru/videos/2046130786-6618.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=qmIzzGlhifr5LBA1kCq4%2F20250522%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250522T165514Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=ab9e4c867de4ee85df50e3bee05bc65962c5b9e351e964d707f9f7987e5c17d8",
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
