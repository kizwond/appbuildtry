export function onChangeArrayValuesForSwitch(...args) {
  const length = args.length;
  switch (length) {
    case 7:
      if (args[0]) {
        const new_array = [...args[3][args[4]][args[5]][args[6]], args[2]];
        console.log(
          `현재 ${args[6]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
        args[1](new_array, args[3], args[4], args[5], args[6]);
      } else {
        const new_array = args[3][args[4]][args[5]][args[6]].filter(
          (item) => item !== args[2]
        );
        args[1](new_array, args[3], args[4], args[5], args[6]);
        console.log(
          `현재 ${args[6]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
      }
      break;

    case 6:
      if (args[0]) {
        const new_array = [...args[3][args[4]][args[5]], args[2]];
        console.log(
          `현재 ${args[5]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
        args[1](new_array, args[3], args[4], args[5]);
      } else {
        const new_array = args[3][args[4]][args[5]].filter(
          (item) => item !== args[2]
        );
        args[1](new_array, args[3], args[4], args[5]);
        console.log(
          `현재 ${args[5]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
      }
      break;

    case 5:
      if (args[0]) {
        const new_array = [...args[3][args[4]], args[2]];
        console.log(
          `현재 ${args[4]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
        args[1](new_array, args[3], args[4]);
      } else {
        const new_array = args[3][args[4]].filter((item) => item !== args[2]);
        args[1](new_array, args[3], args[4]);
        console.log(
          `현재 ${args[4]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
      }
      break;

    case 4:
      if (args[0]) {
        const new_array = [...args[3], args[2]];
        console.log(
          `현재 ${args[3]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
        args[1](new_array, args[3]);
      } else {
        const new_array = args[3].filter((item) => item !== args[2]);
        args[1](new_array, args[3]);
        console.log(
          `현재 ${args[3]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
          new_array
        );
      }
      break;

    default:
      console.log('스위치펑션 잘못되었음');
      break;
  }
}
