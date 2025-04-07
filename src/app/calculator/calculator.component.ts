import { Component } from '@angular/core';//最新状態
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Decimal } from 'decimal.js'

@Component({
  selector: 'app-calculator',
  imports: [FormsModule, CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  currentValue: string = ''; // 現在の値
  previousValue: Decimal | null = null; // 前回の値
  operation: string | null = null; // 演算子
  displayValue: string = '0'; // 表示する値
  history: string[] = ['「計算履歴」最大、過去2件まで表示',`割引計算は「数値-割引数%」の順に入力`,'10億桁以上は表示できません']; // 履歴
  currentFormula: string = ''; // 現在の計算式
  isReturnActive: boolean = false; // リターン操作を示す
  returnFormula: string = ''; // リターン操作の式
  stateStack: Array<{ 
    displayValue: string;
    previousValue: Decimal | null;
    operation: string | null;
    currentValue: string;
    currentFormula: string;
  }> = []; // 状態を保存する
  discountRate:number | null = null;

  inputNumber(value: string): void {
    // 初回の「-」入力は負の数として扱う
    if (this.currentValue === '' && value === '-') {
        this.currentValue = '-';
        this.currentFormula = '-';
    } else {
        this.currentValue += value;
        this.currentFormula += value;
    }

    // 現在の値が100億桁以上になっていないかをチェック
    const numericValue = this.currentValue.replace('-', ''); // 負号を除いて桁数を確認
    if (numericValue.length > 10) { // 最大10桁まで許容
        this.currentValue = this.currentValue.slice(0, -1); // 最後の入力を取り消す
        this.currentFormula = this.currentFormula.slice(0, -1); // 式の最後の入力も取り消す
        return; // 処理を中断
    }

    // 数値として無効な値が入らないようチェック
    if (!this.isValidNumber(this.currentValue)) {
        throw new Error('無効な数値が入力されています');
    }

    this.displayValue = this.currentValue;
    this.saveState();
}

private isValidNumber(value: string): boolean {
    return /^-?\d*\.?\d*$/.test(value); // 負の数、小数を正しく認識
}

  // 小数点ボタンが押されたら
inputDecimal(): void {
    if (!this.currentValue.includes('.')) {
        this.currentValue += this.currentValue === '' ? '0.' : '.';
        this.currentFormula = `${this.currentFormula}.`; // 小数点を反映
    }
    this.displayValue = this.currentValue;
    this.saveState();
}

setOperation(op: string): void {
  if (this.previousValue === null && this.currentValue === '') {
      // 初回の操作で「-」以外の演算子が押された場合にエラー
      if (op !== '-') {
          this.displayValue = '数値を入力してください';
          return;
      }
  }

  if (this.previousValue === null) {
      // 初回値を設定
      this.previousValue = new Decimal(this.currentValue || '0');
  }

  // 連続で演算子が押された場合に前の演算子を置き換える
  if (this.operation !== null && this.currentValue === '') {
      // 直前の演算子を削除し、新しい演算子で置き換える
      this.currentFormula = this.currentFormula.slice(0, -3); // 演算子と空白を削除
      this.currentFormula += ` ${op} `;
  } else {
      // 通常の処理
      this.currentFormula += ` ${op} `;
  }

  this.operation = op; // 新しい演算子を設定
  this.currentValue = ''; // 現在の値をリセット
  this.saveState();
}


calculate(): void {
  this.currentFormula = this.preprocessFormula(this.currentFormula);

  if (this.currentFormula !== '') {
      try {
          const tokens = this.tokenize(this.currentFormula);

          // トークン数チェック
          if (tokens.length < 3) {
              throw new Error('不完全な式です');
          }
          // 優先順位を考慮して計算
          const intermediateResult = this.processOperators(tokens, ['*', '/']);
          const finalResult = this.processOperators(intermediateResult, ['+', '-']);

          const result = new Decimal(finalResult[0]);

          // **桁数チェック**: 数値が大きすぎる場合にエラーを表示
          const resultString = result.toFixed(); // 結果を文字列として取得
          if (resultString.length > 10) { // 10桁以上かチェック
              this.displayValue = 'エラー: 数字が大きすぎます';
              this.history.push('エラー: 数字が大きすぎます');
              return;
          }
          // 結果を表示
          this.displayValue = result.mod(1).isZero() ? result.toFixed(0) : result.toFixed(8);

          // 履歴を更新
          this.history.push(`${this.currentFormula} = ${this.displayValue}`);
          if (this.history.length > 2) {
              this.history.shift(); // 古い履歴を削除
          }

          // 初期値に更新
          this.previousValue = result; 
          this.currentFormula = this.displayValue; 
          this.currentValue = ''; 
          this.operation = null;
      } catch (error) {
          this.displayValue = error instanceof Error ? `エラー: ${error.message}` : '不明なエラーが発生しました';
      }
  }
}

setDiscount(): void {
  // 必要な条件を確認
  if (this.previousValue === null || this.currentValue === '') {
      this.displayValue = ' 割引値が不足しています';
      return;
  }

  const baseValue = this.previousValue; // 元の値
  const discountRate = new Decimal(this.currentValue); // 割引率

  // 割引率の範囲チェック
  if (discountRate.gte(100) || discountRate.lt(0)) {
      this.displayValue = 'エラー: 割引率は0～100の間で指定してください';
      return;
  }
  // 割引値を計算
  const discountAmount = baseValue.times(discountRate).div(100); // 割引額
  const result = baseValue.minus(discountAmount); // 割引後の金額

  // 結果を表示
  this.displayValue = result.mod(1).isZero()? result.toFixed(0): result.toFixed(8);

  // 履歴を更新
  this.history.push(`${baseValue.toFixed(0)} - ${discountRate.toFixed(2)}% = ${this.displayValue}`);
  if (this.history.length > 2) {
      this.history.shift(); // 古い履歴を削除
  }

  // 状態を更新
  this.previousValue = result;
  this.currentValue = ''; // 割引率をリセット
  this.operation = null;

  this.saveState(); // 状態を保存
}

private tokenize(formula: string): string[] {
  const tokens = formula.match(/(?<!\d)-?\d+(\.\d+)?|[+\-*/]/g);
  if (!tokens || tokens.length === 0) {
      throw new Error('式が無効です');
  }
  return tokens;
}

private processOperators(tokens: string[], operators: string[]): string[] {
  const stack: string[] = [];
  let i = 0;

  while (i < tokens.length) {
      const token = tokens[i];

      if (operators.includes(token)) {
          const left = new Decimal(stack.pop() || '0');
          const right = new Decimal(tokens[++i]);
          let result = new Decimal(0);

          // 演算子に基づいて計算
          if (token === '*') {
              result = left.times(right);
          } else if (token === '/') {
              if (right.isZero()) {
                  throw new Error('ゼロ除算エラー');
              }
              result = left.div(right);
          } else if (token === '+') {
              result = left.plus(right);
          } else if (token === '-') {
              result = left.minus(right);
          }

          stack.push(result.toFixed(8)); 
      } else {
          stack.push(token); 
      }

      i++;
  }

  return stack;
}

returnToPreviousState(): void {
  if (this.stateStack.length > 1) {
      this.stateStack.pop();
      const previousState = this.stateStack[this.stateStack.length - 1];

      // 状態を復元
      this.currentValue = previousState.currentValue;
      this.previousValue = previousState.previousValue;
      this.operation = previousState.operation;
      this.displayValue = previousState.displayValue;
      this.currentFormula = previousState.currentFormula;

      this.isReturnActive = false;
  }
}

private saveState(): void {
  this.stateStack.push({
      displayValue: this.displayValue,
      previousValue: this.previousValue,
      operation: this.operation,
      currentValue: this.currentValue,
      currentFormula: this.currentFormula,
  });
}

  updateFormula(value: string): void {
    this.currentFormula += value;
  }

  get formulaPlaceholder(): string {
    return this.currentFormula === '' ? '式' : this.currentFormula;
  }

  get resultPlaceholder(): string {
    return this.displayValue === '' ? '結果' : this.displayValue;
  }

  clear(): void {
    this.currentValue = '';
    this.previousValue = null;
    this.operation = null;
    this.displayValue = '0';
    this.currentFormula = '';
    this.saveState();
  }

  clearHistory(): void {
    this.history = ['計算履歴'];
    this.saveState();
  }

  private preprocessFormula(formula: string): string {
    return formula.replace(/\s+/g, '').replace(/(\d+)\.(\d+)/g, '$1.$2'); // 必要なら空白や形式を調整
}


}