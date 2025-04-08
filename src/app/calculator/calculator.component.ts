import { Component } from '@angular/core';//saisinnjyoutai
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
  history: string[] = ['「計算履歴」過去2件まで表示',`割引計算は「数値-割引数%」の順`]; // 履歴
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

     // エラー状態の場合はリセットして新しい入力を受け付ける
     if (this.currentFormula.includes('E:')) {
      this.clear(); // 状態をリセット
  }

    if (this.currentFormula.replace(/\s+/g, '').length >= 22) {
      this.currentFormula = 'E:これ以上は入力不可'; // エラーメッセージを表示
      return; // 処理を終了
  }

    // 10桁以上の入力は無視（負号を除く桁数をカウント）
    if (this.currentValue.replace(/^-/, '').length >= 10) {
        return; // 入力を無視
    }

    // 初回入力が「-」の場合（負号）
    if (this.currentValue === '' && value === '-') {
        this.currentValue = '-';
        this.currentFormula = '-';
        return;
    }

    // 負号の後に「0」を入力（負のゼロの状態を保持）
    if (this.currentValue === '-' && value === '0') {
        this.currentValue = '-0';
        this.currentFormula = '-0';
        return;
    }

    // 「-0」の後に小数点を入力する場合
    if (this.currentValue === '-0' && value === '.') {
        this.currentValue = '-0.';
        this.currentFormula = '-0.';
        return;
    }

    // 「-0.x」の後に数字を入力する場合
    if (this.currentValue.startsWith('-0') && this.currentValue.includes('.') && value.match(/\d/)) {
        this.currentValue += value;
        this.currentFormula += value;
        return;
    }


    // 0の後に数字を入力する場合
    if(this.currentValue === '0' && value !== '0'){
      this.currentValue = value;
      this.currentFormula = value;
      return;
    }

    // 演算子直後に数字を入力する場合の処理
    if (this.operation !== null && this.currentValue === '') {
        this.currentValue = value; // 演算子後に新しい数値を設定
        this.currentFormula += value;
        this.displayValue = this.currentValue;
        return;
    }

    // 通常の負の数入力（「-」で始まり数字が続く場合）
    if (this.currentValue.startsWith('-') && value.match(/\d/)) {
        this.currentValue += value;
        this.currentFormula += value;
        return;
    }

    // 初回入力が「0」の場合
    if (this.currentValue === '' && value === '0') {
        this.currentValue = '0';
        this.currentFormula = '0';
        return;
    }

    // 「0」の連続入力を防ぐ（ただし「0.」は許可）
    if (this.currentValue === '0' && value === '0' && !this.currentValue.includes('.')) {
        return; // 処理を無視
    }

    // 通常の入力処理
    this.currentValue += value;
    this.currentFormula += value;

    // 数値として無効な状態を検出（負号、小数点を考慮）
    if (!this.isValidNumber(this.currentValue)) {
        this.currentFormula = 'E:無効な数値が入力されています';
        return;
    }

    this.displayValue = this.currentValue;
    this.saveState();
}

private isValidNumber(value: string): boolean {
    return /^-?\d*\.?\d*$/.test(value); // 負の数、小数を正しく認識
}

  // 小数点ボタンが押されたら
inputDecimal(): void {
  if (this.operation !== null && this.currentValue === '') {
    this.displayValue = 'E:演算子の後に小数点は入力不可'; // メッセージを表示
    return; // 処理を終了
}

    if (!this.currentValue.includes('.')) {
        this.currentValue += this.currentValue === '' ? '0.' : '.';
        this.currentFormula = `${this.currentFormula}.`; // 小数点を反映
    }
    this.displayValue = this.currentValue;
    this.saveState();
}

setOperation(op: string): void {

  // エラー状態の場合はリセットして新しい演算子を受け付ける
  if (this.currentFormula.includes('E:')) {
    this.clear(); // 状態をリセット
}

  // 小数点が入力されている場合は演算子を無効化
  if (this.currentValue.endsWith('.')) {
      return;
  }
  let displayOp = op; // 初期値はそのままの演算子
  if (op === '*') {
      displayOp = '×'; // 表示用は「×」
  } else if (op === '/') {
      displayOp = '÷'; // 表示用は「÷」
  }

  if (this.previousValue === null && this.currentValue === '') {
      // 初回の操作で「-」以外の演算子が押された場合にエラー
      if (op !== '-') {
          this.currentFormula = 'E:数値を入力してください';
          return;
      }
  }

  if (this.previousValue === null) {
      // 初回値を設定
      this.previousValue = new Decimal(this.currentValue || '0');
  }

  // 連続で演算子が押された場合に前の演算子を置き換える
  if (this.operation !== null && this.currentValue === '') {
      this.currentFormula = this.currentFormula.slice(0, -3); // 演算子と空白を削除
      this.currentFormula += ` ${displayOp} `;
  } else {
      // 通常の処理
      this.currentFormula += ` ${displayOp} `;
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
              this.currentFormula = 'E:不完全な式です';
              return;
          }

          // 優先順位を考慮して計算
          const intermediateResult = this.processOperators(tokens, ['*', '/']);
          const finalResult = this.processOperators(intermediateResult, ['+', '-']);

          const result = new Decimal(finalResult[0]);

          // **計算結果の桁数チェック**
          const resultString = result.toFixed(); // 結果を文字列として取得
          if (resultString.length > 10) {
              if (this.history.length >= 2) {
                  this.history.shift(); // 古い履歴を削除
              }
              this.currentFormula = 'E:結果が大きすぎます';
              this.history.push('E:結果が大きすぎます');
              this.previousValue = null;
              this.currentValue = '';
              return;
          }

          // 結果を表示
          this.displayValue = result.mod(1).isZero() ? result.toFixed(0) : result.toFixed(8);

          // 履歴の演算子を表示用に変換して更新
          const displayFormula = this.currentFormula
              .replace(/\*/g, '×') // * を × に変換
              .replace(/\//g, '÷'); // / を ÷ に変換

          if (this.history.length >= 2) {
              this.history.shift(); // 先に古い履歴を削除
          }
          this.history.push(`${displayFormula} = ${this.displayValue}`); // 新しい履歴を追加

          // 初期値に更新
          this.previousValue = result;
          this.currentFormula = this.displayValue;
          this.currentValue = '';
          this.operation = null;
      } catch (error) {
          const errorMessage = error instanceof Error ? `E: ${error.message}` : 'E:不明なエラーが発生しました';
          this.displayValue = errorMessage;
          this.currentFormula = errorMessage; // currentFormula にもエラーを反映
      }
  }
}

setDiscount(): void {
  // 必要な条件を確認
  if (this.previousValue === null || this.currentValue === '') {
      this.displayValue = 'E:割引値が不足しています';
      return;
  }

  const baseValue = this.previousValue; // 元の値
  const discountRate = new Decimal(this.currentValue); // 割引率

  // 割引率の範囲チェック
  if (discountRate.gte(100) || discountRate.lt(0)) {
      this.displayValue = 'E:割引率は0～100の間で指定してください';
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
      throw new Error('E:式が無効です');
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
                  throw new Error('E:ゼロ除算エラー');
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
    return formula.replace(/\s+/g, '').replace(/(\d+)\.(\d+)/g, '$1.$2').replace(/\s+/g,'').replace(/×/g,'*').replace(/÷/g,'/'); // 必要なら空白や形式を調整
}


}