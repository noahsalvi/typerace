import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "minuteSeconds"
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const seconds = value - minutes * 60;
    if (seconds < 10) {
      const temp: string = "0" + (value - minutes * 60);

      return minutes + ":" + temp;
    }
    return minutes + ":" + seconds;
  }
}
