'use client';

/**
 * data/f1DramaData.ts
 * F1 Human Drama, Iconic Rivalries, Civil Wars & Emotional Sagas
 * Designed for beginners and enthusiasts to experience F1 like an ongoing epic series.
 */

export type DramaCategory = 'rivalry' | 'civil_war' | 'triumph' | 'saga';

export interface IconicQuote {
  speaker: string;
  quote: string;
  context: string;
}

export interface DramaEpisode {
  id: string;
  category: DramaCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  era: string;
  protagonists: {
    name: string;
    code: string;
    role: string;
    avatarUrl?: string;
    team: string;
    color: string;
  }[];
  tagline: string;
  overview: string;
  acts: {
    actNumber: number;
    actTitle: string;
    description: string;
    pivotalMoment: string;
  }[];
  iconicQuotes: IconicQuote[];
  decisiveGrandPrix: {
    gp: string;
    year: number;
    summary: string;
    videoOrRadioHighlight: string;
  };
  aftermath: string;
  whyItMatters: string;
}

export interface RelationshipConnection {
  source: string;
  target: string;
  relationType: 'mentor' | 'bro' | 'rival' | 'tense';
  label: string;
  description: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────
// 1. EPIC DRAMA EPISODES (8 ICONIC SAGAS)
// ─────────────────────────────────────────────────────────────

export const F1_DRAMA_EPISODES: DramaEpisode[] = [
  {
    id: 'hamilton-verstappen-2021',
    category: 'rivalry',
    categoryLabel: '世紀のライバル死闘',
    title: 'ルイス・ハミルトン vs マックス・フェルスタッペン (2021)',
    subtitle: '7冠の絶対王者と新世代の暴風が激突した、22戦に及ぶ歴史上最大の死闘',
    era: '2021年シーズン (全22戦)',
    protagonists: [
      {
        name: 'ルイス・ハミルトン',
        code: 'HAM',
        role: '7度の世界王者 / 歴代最多勝の絶対帝王',
        avatarUrl: '/images/drivers/portraits/lewis-hamilton.jpg',
        team: 'Mercedes-AMG',
        color: '#2dd4bf',
      },
      {
        name: 'マックス・フェルスタッペン',
        code: 'VER',
        role: '王座を狙う超攻撃的新世代の怪物',
        avatarUrl: '/images/drivers/portraits/max-verstappen.jpg',
        team: 'Red Bull Racing',
        color: '#38bdf8',
      },
    ],
    tagline: '「同ポイントで迎えた最終戦、最終周。勝者がすべてを手に入れる。」',
    overview:
      '現代F1で最もドラマチックかつ論争を巻き起こしたシーズン。1年間を通じて接触、ペナルティ、チーム代表同士の場外乱闘が続き、22戦を戦ってまったくの「同ポイント」でアブダビ最終戦を迎えるという、漫画でも描けない奇跡的なシチュエーションが現実となった。',
    acts: [
      {
        actNumber: 1,
        actTitle: 'シルバーストーンの51G大激突',
        description:
          'イギリスGPの1周目コプスコーナー。一歩も引かない2台が時速290km/hで接触。フェルスタッペンはタイヤバリアに51Gの衝撃で叩きつけられ救急搬送。ペナルティを受けながら逆転優勝したハミルトンが歓喜の英国旗を掲げる姿に、レッドブル陣営の怒りが爆発した。',
        pivotalMoment: '時速290km/hでのコプス接触と、51Gクラッシュ後の救急搬送。',
      },
      {
        actNumber: 2,
        actTitle: 'モンツァ：マシンの上にマシンが乗った日',
        description:
          'イタリアGPの第1シケイン。ピットストップの遅れでコース上で並んだ2台。縁石に跳ね上げられたフェルスタッペンのレッドブルがハミルトンの頭上へ乗り上げ、ヘイロー（頭部保護デバイス）がハミルトンの命を救った。2台はグラベルに重なったままリタイア。',
        pivotalMoment: 'ヘイローがタイヤを受け止め、奇跡的に無傷だった決定的瞬間。',
      },
      {
        actNumber: 3,
        actTitle: 'アブダビ最終周：運命のセーフティカー解除',
        description:
          '最終戦アブダビGP。ハミルトンが独走し8度目の戴冠が確実と思われた残り5周、ラティフィのクラッシュでセーフティカー導入。レッドブルは即座に新品ソフトタイヤへ交換。レースディレクターの劇的な判断で最終周のみレースが再開され、ターン5でフェルスタッペンが一撃のオーバーテイクを決めた。',
        pivotalMoment: '最終周ターン5のインへの飛び込みと、歓喜の無線号泣。',
      },
    ],
    iconicQuotes: [
      {
        speaker: 'ルイス・ハミルトン',
        quote: '「This has been manipulated, man.（これは操作されているよ）」',
        context: 'アブダビGP最終周、SC解除直後の無線',
      },
      {
        speaker: 'マックス・フェルスタッペン',
        quote: '「OH MY GOD! YES! YES! I LOVE YOU GUYS SO MUCH!」',
        context: 'チェッカーを受け、悲願の初チャンピオンを獲得した瞬間の号泣無線',
      },
      {
        speaker: 'トト・ヴォルフ',
        quote: '「No, Michael, no, no, Michael, that was so not right!」',
        context: 'セーフティカー早期解除に対するレースコントロールへの絶叫',
      },
    ],
    decisiveGrandPrix: {
      gp: '2021年 アブダビGP (ヤス・マリーナ)',
      year: 2021,
      summary:
        '同ポイントで迎えた最終戦。57周をハミルトンが支配するも、残り1周のスーパープレイでフェルスタッペンが世界王座を奪取。',
      videoOrRadioHighlight: '🎙️ トト・ヴォルフの「No Michael No!」とレッドブル陣営の狂喜乱舞',
    },
    aftermath:
      'FIAのセーフティカールール見直しとレースディレクター解任にまで発展。この死闘を経てフェルスタッペンは新時代の絶対王者へ君臨し、ハミルトンは2025年のフェラーリ電撃移籍という新たな挑戦へと歩みを進めることになる。',
    whyItMatters:
      '初心者がF1を見る上で「現在の勢力図」を決定づけた最も重要なシーズン。この因縁を知っていると、現在のフェルスタッペンとハミルトンの位置関係が10倍深く理解できる。',
  },
  {
    id: 'senna-prost-1988-1990',
    category: 'rivalry',
    categoryLabel: '伝説の神話・宿命の対決',
    title: 'アイルトン・セナ vs アラン・プロスト (1988 - 1990)',
    subtitle: '「神に愛された天才」と「計算尽くの教授」。マクラーレン・ホンダで起きた骨肉の争い',
    era: '1988年 〜 1990年',
    protagonists: [
      {
        name: 'アイルトン・セナ',
        code: 'SEN',
        role: '「音速の貴公子」神がかり的な速さと情熱の申し子',
        avatarUrl: '/images/drivers/portraits/ayrton-senna.jpg',
        team: 'McLaren-Honda',
        color: '#f59e0b',
      },
      {
        name: 'アラン・プロスト',
        code: 'PRO',
        role: '「プロフェッサー (教授)」レース全体を逆算する知性派',
        avatarUrl: '/images/drivers/portraits/alain-prost.jpg',
        team: 'McLaren-Honda / Ferrari',
        color: '#ef4444',
      },
    ],
    tagline: '「同じマシン、最強のホンダV6ターボ。互いに勝つことだけが生きる意味だった。」',
    overview:
      'モータースポーツの歴史上、最も有名で激烈なライバル関係。16戦15勝を記録した最強マクラーレン・ホンダでチームメイトとなった2人は、やがて口も利かない関係へと冷え込み、2年連続で「日本GP鈴鹿」での大激突によってタイトルが決着するという神話的ドラマを生んだ。',
    acts: [
      {
        actNumber: 1,
        actTitle: '1989年 鈴鹿シケイン：接触と失格のドラマ',
        description:
          'タイトル争いの天王山、鈴鹿のシケイン手前。インに飛び込んだセナに対し、プロストが意図的にステアリングを切ってドアを閉め、2台は絡み合って停止。プロストはマシンを降りて王座をアピール。セナは押しがけでコース復帰しトップチェッカーを受けるも、レース後にシケイン不通過で失格処分を下され、プロストの戴冠が決まった。',
        pivotalMoment: 'シケインでの接触後、プロストが静かに車を降りて歩き去った瞬間。',
      },
      {
        actNumber: 2,
        actTitle: '1990年 鈴鹿1コーナー：時速270km/hの復讐',
        description:
          'プロストがフェラーリへ移籍して迎えた翌1990年の鈴鹿。ポールポジションのグリッド位置（汚れたイン側）に憤慨したセナは、スタート直後の第1コーナーでアウトから先行したプロストのリアへ時速270km/hでノーブレーキ特攻。2台は大クラッシュで即リタイアし、その瞬間にセナのワールドチャンピオンが確定した。',
        pivotalMoment: 'スタートからわずか9秒後、砂煙を上げて2台がグラベルへ飛び出した一撃。',
      },
    ],
    iconicQuotes: [
      {
        speaker: 'アイルトン・セナ',
        quote: '「自分自身を限界まで追い込まないなら、レーシングドライバーである意味はない。」',
        context: '限界領域でのドライビング哲学について語った言葉',
      },
      {
        speaker: 'アラン・プロスト',
        quote: '「セナは僕を倒すためなら、死んでも構わないと思って走っていた。僕は家族のために生きて帰りたかった。」',
        context: '後年のインタビューでセナとの戦いを振り返った言葉',
      },
    ],
    decisiveGrandPrix: {
      gp: '1989年 & 1990年 日本グランプリ (鈴鹿サーキット)',
      year: 1989,
      summary: '日本の鈴鹿サーキットが2年連続で世界の頂点を決める歴史の舞台となった。',
      videoOrRadioHighlight: '🏁 鈴鹿シケインでの接触と、翌年の1コーナー特攻シーン',
    },
    aftermath:
      'プロストの引退後、2人は互いの偉大さを認め合い親友となった。1994年サンマリノGPでセナが事故死する直前、無線で「アラン、君がいなくて寂しいよ」と語りかけたエピソードは涙なしには語れない。',
    whyItMatters:
      'F1の「美学」「哲学」「宿命」のすべてが詰まった原点。日本のF1ブームの中心にあった物語。',
  },
  {
    id: 'rosberg-hamilton-2016',
    category: 'civil_war',
    categoryLabel: 'チームメイト内紛・お家騒動',
    title: 'ニコ・ロズベルグ vs ルイス・ハミルトン (2013 - 2016)',
    subtitle: 'カート時代からの幼馴染が、世界王座のために魂を削り合った「銀矢の冷戦」',
    era: '2016年シーズン',
    protagonists: [
      {
        name: 'ニコ・ロズベルグ',
        code: 'ROS',
        role: '父ケケに続く戴冠を目指す精密な秀才',
        avatarUrl: '/images/drivers/portraits/nico-hulkenberg.jpg',
        team: 'Mercedes-AMG',
        color: '#2dd4bf',
      },
      {
        name: 'ルイス・ハミルトン',
        code: 'HAM',
        role: '圧倒的な生来のスピードを誇る盟友',
        avatarUrl: '/images/drivers/portraits/lewis-hamilton.jpg',
        team: 'Mercedes-AMG',
        color: '#2dd4bf',
      },
    ],
    tagline: '「世界チャンピオンになった。そして、その5日後に引退した。」',
    overview:
      '10代の頃から同じホテルに泊まり、カートで世界を転戦した親友同士。しかしメルセデスの圧倒的1強時代、世界王座を争う唯一のライバルとなったことで友情は完全に崩壊。2016年スペインGPでは1周目に同士討ちクラッシュを演じるなど泥沼の心理戦を展開した。',
    acts: [
      {
        actNumber: 1,
        actTitle: '2016年 スペインGP：スタート直後の共倒れ',
        description:
          'ターン1で先行したロズベルグのマシンがエンジンモード設定ミスで失速。インを突いたハミルトンが芝生に押し出されてスピンし、ロズベルグを巻き込んで2台とも大破。メルセデス首脳陣を激怒させた最悪の同士討ち。',
        pivotalMoment: 'ターン4のグラベルで呆然とヘルメットを抱えるハミルトン。',
      },
      {
        actNumber: 2,
        actTitle: 'アブダビ最終戦：ハミルトンの「バックアップ戦術」',
        description:
          'ロズベルグは3位以内で自力戴冠。首位を走るハミルトンは、チームからの「ペースを上げろ」という無線指示を無視して意図的にスロー走行（バックアップ）を行い、後続のベッテルとフェルスタッペンにロズベルグを抜かせようと画策。ロズベルグは極限の重圧に耐え抜き2位でチェッカーを受けた。',
        pivotalMoment: '「Lewis, this is Paddy, we need you to pick up the pace」への完全無視。',
      },
    ],
    iconicQuotes: [
      {
        speaker: 'ニコ・ロズベルグ',
        quote: '「山を登りきった。頂上に到達した。これ以上のエネルギーは残っていない。」',
        context: '初戴冠からわずか5日後の衝撃的な電撃引退会見',
      },
      {
        speaker: 'ルイス・ハミルトン',
        quote: '「僕たちは友人だった。でも、今はビジネスライバルだ。」',
        context: '緊迫する関係性について問われた記者会見での一言',
      },
    ],
    decisiveGrandPrix: {
      gp: '2016年 アブダビグランプリ',
      year: 2016,
      summary: 'ロズベルグが悲願のワールドチャンピオン獲得、その直後に前代未聞の引退を発表。',
      videoOrRadioHighlight: '🏁 最終周の緊張感あふれる防衛と、表彰台での歓喜の雄叫び',
    },
    aftermath:
      'すべてを犠牲にしてハミルトンを打ち負かしたロズベルグは、これ以上の家庭や健康の犠牲を拒み電撃引退。ハミルトンを破るために人間がどれほどの代償を払わねばならないかを証明した。',
    whyItMatters:
      '「同じマシンに乗るチームメイトこそが最大の敵」というF1の残酷な真理を最も美しく描き出したストーリー。',
  },
  {
    id: 'gasly-monza-redemption-2020',
    category: 'triumph',
    categoryLabel: '涙の復活・感動の初優勝',
    title: 'ピエール・ガスリー：どん底からのモンツァ奇跡優勝 (2020)',
    subtitle: 'トップチームからの非情な降格、親友の死。絶望の淵から掴み取った感動の初戴冠',
    era: '2019年 〜 2020年',
    protagonists: [
      {
        name: 'ピエール・ガスリー',
        code: 'GAS',
        role: '苦難を乗り越えたフランスの若武者',
        avatarUrl: '/images/drivers/portraits/pierre-gasly.jpg',
        team: 'Scuderia AlphaTauri (Honda)',
        color: '#0284c7',
      },
    ],
    tagline: '「表彰台の上、誰もいなくなった静寂の中で、彼は一人座り込んで空を見上げた。」',
    overview:
      '2019年、念願のレッドブル昇格を果たすもマシンに適応できず、わずか半年でトロロッソ（現RB）へ非情の途中降格。さらに降格直後のベルギーGPで、幼少期からの大親友アントワーヌ・ユベールがレース中の大事故で他界。人生のどん底に突き落とされた男が、2020年イタリアGPモンツァで奇跡の大逆転勝利を飾る。',
    acts: [
      {
        actNumber: 1,
        actTitle: '非情の降格通告と親友の悲劇',
        description:
          '2019年夏、レッドブルから一方的な降格を通告される。さらに精神的支柱だった親友ユベールをスパで失う。「人生で最悪の1週間だった」と語る過酷な現実の中で、ガスリーは腐ることなくステアリングを握り続けた。',
        pivotalMoment: '親友のヘルメットデザインを身につけて走り続けた日々。',
      },
      {
        actNumber: 2,
        actTitle: '2020年 モンツァ：奇跡の巡り合わせとサインツの猛追',
        description:
          'セーフティカー導入直前の完璧なピットインとハミルトンのペナルティにより、赤旗再開後に首位へ浮上。残り25周、後方から猛烈な勢いで迫るマクラーレンのサインツ。わずか0.4秒差の極限のプレッシャーを守り抜き、アルファタウリ（旧トロロッソ）に12年ぶりの歴史的勝利をもたらした。',
        pivotalMoment: 'チェッカーフラッグ直後の絶叫無線: 「WHAT DID WE DO?! WE WON THE RACE!」',
      },
      {
        actNumber: 3,
        actTitle: '表彰台での一人だけの時間',
        description:
          'シャンパンファイトが終わり、チームクルーが引き上げた後も、ガスリーは表彰台の最上段に一人座り込み、トロフィーを抱きながら夕暮れの空を見つめ続けた。亡き親友に勝利を報告したその姿は、世界中のモータースポーツファンの涙を誘った。',
        pivotalMoment: '世界中のメディアが絶賛した、夕暮れの表彰台で一人佇む写真。',
      },
    ],
    iconicQuotes: [
      {
        speaker: 'ピエール・ガスリー',
        quote: '「WHAT DID WE JUST DO?! WE WON THE RACE!! OH MY GOD!!」',
        context: 'モンツァのチェッカーを受けた瞬間の絶叫無線',
      },
      {
        speaker: 'ピエール・ガスリー',
        quote: '「表彰台に座っていたあの数分間、これまでの苦しかったこと、支えてくれた人たち、そしてアントワーヌのことが頭を巡っていた。」',
        context: 'レース後の公式記者会見での回想',
      },
    ],
    decisiveGrandPrix: {
      gp: '2020年 イタリアグランプリ (モンツァ)',
      year: 2020,
      summary: '下位中団チームが常勝メルセデスを破った、2020年代で最も感動的なグランプリ。',
      videoOrRadioHighlight: '🎙️ ガスリーの感情爆発無線と、夕暮れの表彰台ソロショット',
    },
    aftermath:
      'フランス人ドライバーとして24年ぶりのF1優勝。この復活劇でガスリーのパドックでの評価は不動のものとなり、2023年に母国アルピーヌのワークスシートを獲得した。',
    whyItMatters:
      '「挫折しても諦めなければ道は開ける」ことを実証した、すべての人の心を打つ真のヒューマンドラマ。',
  },
  {
    id: 'ricciardo-monaco-redemption-2018',
    category: 'triumph',
    categoryLabel: '雪辱と救済のドラマ',
    title: 'ダニエル・リカルド：2018モナコ雪辱「失われた勝利の奪還」',
    subtitle: 'ピットミスで失った2年前の涙。パワーの25%を失った手負いのマシンで掴んだ栄冠',
    era: '2016年 〜 2018年',
    protagonists: [
      {
        name: 'ダニエル・リカルド',
        code: 'RIC',
        role: '「ハニーバジャー」モナコを愛し、モナコに泣いた男',
        avatarUrl: '/images/drivers/portraits/daniel-ricciardo.jpg',
        team: 'Red Bull Racing',
        color: '#38bdf8',
      },
    ],
    tagline: '「2年前に奪われた勝利を、今日取り戻した。救済だ。」',
    overview:
      '2016年モナコGP、ポールポジションから独走していたリカルドは、チームのピットタイヤ準備ミスで呆然と勝利を奪われ表彰台で言葉を失った。その2年後、再びポールから逃げるリカルドのマシンをMGU-K故障（約160馬力ダウン）が襲う。ギア抜けと熱ダレと戦いながら50周守り切った執念のドラマ。',
    acts: [
      {
        actNumber: 1,
        actTitle: '2016年の悲劇：用意されていなかったタイヤ',
        description:
          '雨のモナコで首位独走中、ピットに呼ばれて停止したリカルド。しかしピットクルーはタイヤを用意しておらず、13秒もの停止を余儀なくされハミルトンに敗北。表彰台でのリカルドの凍りついた瞳はパドックを悲痛に包んだ。',
        pivotalMoment: 'ピットクルーが慌ててガレージ奥へタイヤを取りに走る絶望の映像。',
      },
      {
        actNumber: 2,
        actTitle: '2018年：28周目のMGU-K全喪失',
        description:
          '首位快走中の28周目、ハイブリッドシステムのMGU-Kが完全沈黙。パワーが約160馬力低下し、最高速が20km/h落ち、リアブレーキの温度が跳ね上がる。背後にはフェラーリのベッテル。リカルドはブレーキバランスを極限まで前へ移し、ショートシフトを駆使して狭小なモナコをブロックし続けた。',
        pivotalMoment: '「No power! I have no power!」の無線と、エンジニアの「対処法はない、そのまま走れ」という指示。',
      },
    ],
    iconicQuotes: [
      {
        speaker: 'ダニエル・リカルド',
        quote: '「Redemption. 2 years in the making, and we finally did it.」',
        context: '2018年モナコGPチェッカー直後の無線',
      },
      {
        speaker: 'クリスチャン・ホーナー',
        quote: '「You won that with no MGU-K. That was sheer genius. Just like Schumacher in 1994.」',
        context: 'レース直後のチーム代表からの最大級の賛辞',
      },
    ],
    decisiveGrandPrix: {
      gp: '2018年 モナコグランプリ',
      year: 2018,
      summary: '手負いのマシンでモナコを制圧した、リカルドのキャリア最高峰の傑作。',
      videoOrRadioHighlight: '🍾 モナコのプールに王族の前で飛び込んだ伝説のセレブレーション',
    },
    aftermath:
      'モナコのモンテカルロ・ロイヤルボックスでシャンパンを浴び、モナコのプールへダイブ。F1界で最も愛されるエンターテイナーの最高の一日となった。',
    whyItMatters:
      '「モナコGPがいかに抜きにくく、ドライバーの純粋な技術と精神力が試されるか」を証明した伝説の1戦。',
  },
  {
    id: 'piastri-contract-saga-2022',
    category: 'saga',
    categoryLabel: '法廷闘争＆パドック怪事件',
    title: 'オスカー・ピアストリ電撃ツイート事件 (2022)',
    subtitle: '「私は来年アルピーヌでドライブしない」。ツイート1通でF1界を震撼させた近代最大の契約劇',
    era: '2022年 夏休み (サマーブレイク)',
    protagonists: [
      {
        name: 'オスカー・ピアストリ',
        code: 'PIA',
        role: 'F3・F2を連覇した超大物ルーキー',
        avatarUrl: '/images/drivers/portraits/oscar-piastri.jpg',
        team: 'Alpine → McLaren',
        color: '#fb923c',
      },
    ],
    tagline: '「チームが発表した1時間後、ドライバー本人が全否定した。」',
    overview:
      '2022年8月、アロンソが電撃的にアストンマーティンへ移籍を発表。慌てたアルピーヌは、育成ドライバーのピアストリを2023年の正ドライバーとして昇格させると公式プレスリリースを配信。しかしそのわずか1時間後、ピアストリ本人が「私はアルピーヌと契約していないし、来年ドライブすることもない」とSNSで爆弾投下。裏でマクラーレンと極秘契約していた前代未聞の騒動。',
    acts: [
      {
        actNumber: 1,
        actTitle: 'アルピーヌの独断プレスリリース',
        description:
          'アロンソを失ったアルピーヌ首脳陣は、ピアストリ本人やマネージャー（マーク・ウェバー）の合意を取らずに「2023年ピアストリ起用」を世界へ向けて公式アナウンスした。',
        pivotalMoment: 'アルピーヌの誇らしげな公式画像ツイート。',
      },
      {
        actNumber: 2,
        actTitle: 'ピアストリの電撃カウンターツイート',
        description:
          '日本時間深夜、ピアストリが自身のX（旧Twitter）に「アルピーヌの発表は私の同意なしに行われた。誤りである。私は2023年にアルピーヌでドライブしない」と投稿。世界中のメディアとファンが深夜に大騒乱となった。',
        pivotalMoment: '世界中で何千万回も閲覧された歴史的ツイート。',
      },
    ],
    iconicQuotes: [
      {
        speaker: 'オスカー・ピアストリ',
        quote: '「I understand that, without my agreement, Alpine F1 have put out a press release... this is wrong and I will not be driving for Alpine next year.」',
        context: '2022年8月2日の歴史的投稿',
      },
    ],
    decisiveGrandPrix: {
      gp: 'FIA契約承認委員会 (CRB) 判決',
      year: 2022,
      summary: 'FIAの法廷闘争でマクラーレン側の契約の正当性が100%認められ、ピアストリがマクラーレンへ。',
      videoOrRadioHighlight: '⚖️ マクラーレン移籍後、ルーキーイヤーからスプリント優勝を果たす大活躍',
    },
    aftermath:
      'ピアストリは2023年にマクラーレンでデビューし、いきなり表彰台やスプリント優勝を達成。「冷徹なまでの判断力」と「鋼のメンタル」を持つ次世代エースとしての実力を世界に証明した。',
    whyItMatters:
      'F1の契約・政治・裏での駆け引きがいかにスリリングであるかを象徴する、近代パドック最高のお家騒動。',
  },
  {
    id: 'zhou-shanghai-tears-2024',
    category: 'triumph',
    categoryLabel: '感涙の凱旋ドラマ',
    title: '周冠宇：20年越しの夢、初の母国中国GPでの男泣き (2024)',
    subtitle: '観客席でアロンソの旗を振っていた少年が、母国のヒーローとして帰還した日',
    era: '2024年4月 (中国GP)',
    protagonists: [
      {
        name: '周冠宇 (Zhou Guanyu)',
        code: 'ZHO',
        role: '中国史上初のF1フルタイムドライバー',
        avatarUrl: '/images/drivers/portraits/zhou-guanyu.jpg',
        team: 'Stake F1 Team Kick Sauber',
        color: '#22c55e',
      },
    ],
    tagline: '「20年前、僕はあそこのスタンドでF1の爆音に震えていた。」',
    overview:
      '2004年に初めて開催されたF1中国GP。当時5歳だった周冠宇は上海インターナショナルのスタンドでアロンソのキャップを被り、旗を振っていた。それから20年、コロナ禍で延期が続いていた母国グランプリがついに開催。超満員の5万人の観衆が自分一人のために歓声を上げる中、完走を果たした周冠宇はホームストレートで崩れ落ちて号泣した。',
    acts: [
      {
        actNumber: 1,
        actTitle: '少年時代の写真とヘルメットの思い出',
        description:
          '2024年中国GP開幕前、周冠宇は特別ヘルメットを披露。そこには2004年にスタンドでアロンソのフラッグを握りしめていた幼少期の自分の写真がプリントされていた。',
        pivotalMoment: '幼少期の自分と現在の自分が対比された記念ヘルメット。',
      },
      {
        actNumber: 2,
        actTitle: 'ホームストレート特設パーキングと大歓声',
        description:
          '決勝レースを無事完走。F1公式は特例として、ポイント圏外だった周冠宇のためにホームストレート上に専用の停車エリアを用意。マシンを降りた瞬間、スタンドから割れんばかりの「ジョー！」コールが沸き起こり、感情を抑えきれずに両膝をついて涙を流した。',
        pivotalMoment: 'ヘルメットを脱ぎ、両手で顔を覆って泣き崩れる周冠宇の姿。',
      },
    ],
    iconicQuotes: [
      {
        speaker: '周冠宇',
        quote: '「20年間この日を夢見てきた。中国の国旗を胸にF1を走れたことは生涯の誇りだ。」',
        context: '上海のホームストレートで大観衆に一礼した後のインタビュー',
      },
    ],
    decisiveGrandPrix: {
      gp: '2024年 中国グランプリ (上海)',
      year: 2024,
      summary: '5年ぶりに復活した上海で、母国のファンが愛する英雄を熱狂的に迎えた。',
      videoOrRadioHighlight: '🎙️ ホームストレートで跪いて号泣する周冠宇と大観衆の地鳴りのような歓声',
    },
    aftermath:
      '中国におけるモータースポーツの歴史を塗り替えた瞬間。2025年よりフェラーリのリザーブドライバーに就任し、新たな章を歩んでいる。',
    whyItMatters:
      'F1が単なる欧州のスポーツではなく、世界中の人々の少年の夢を乗せて走る舞台であることを証明した名場面。',
  },
];

// ─────────────────────────────────────────────────────────────
// 2. PADDOCK RELATIONSHIP CONNECTIONS (WHO'S WHO MAP)
// ─────────────────────────────────────────────────────────────

export const PADDOCK_CONNECTIONS: RelationshipConnection[] = [
  {
    source: 'VER',
    target: 'HAM',
    relationType: 'rival',
    label: '宿命のライバル',
    description: '2021年の死闘を経て互いに敬意を抱きつつも、コース上では一切譲らない究極の対決関係。',
    color: '#ef4444',
  },
  {
    source: 'TSU',
    target: 'GAS',
    relationType: 'bro',
    label: '親友コンビ「カルツノ」',
    description: 'アルファタウリ時代に築かれた大親友関係。別々のチームになってもオフに一緒に食事へ行くパドック公認のブロマンス。',
    color: '#38bdf8',
  },
  {
    source: 'ALO',
    target: 'BOR',
    relationType: 'mentor',
    label: '師弟関係 (マネージャー)',
    description: 'アロンソのマネジメント会社（A14）がボルトレートを育成。アロンソが愛弟子のF1昇格を全力で後押しした。',
    color: '#10b981',
  },
  {
    source: 'NOR',
    target: 'PIA',
    relationType: 'tense',
    label: '新世代の社内ライバル',
    description: 'マクラーレン躍進の立役者コンビ。仲は良好だが、チームオーダーを巡る緊張感が漂うナンバー1争い。',
    color: '#f59e0b',
  },
  {
    source: 'HAM',
    target: 'ANT',
    relationType: 'mentor',
    label: '玉座の継承',
    description: 'ハミルトンがフェラーリへ移籍したことで空いたメルセデスの席を18歳のアントネッリが継承。ハミルトンも大きなエールを送る。',
    color: '#8b5cf6',
  },
  {
    source: 'OCO',
    target: 'GAS',
    relationType: 'tense',
    label: '幼少期からの愛憎劇',
    description: 'フランスの同じ地方で育ちカート時代は親友だったが、あるレースの接触を機に絶縁状態へ。アルピーヌで組んだ際も激しいバトルが続いた。',
    color: '#ec4899',
  },
];
