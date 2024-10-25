import { Component, HostListener } from '@angular/core';

enum ProgramStep {
  Start, //ESTADO INICIAL
  FstNmbrZero, //EL PRIMER NUMERO BINARIO ES 0
  ComplFstNmbr, //OBTENER COMPLEMENTO DEL PRIMER BINARIO (INVERTIR 0s Y 1s)
  MoveRight, //MOVER A LA DERECHA
  DecrFstNmbr, //DECREMENTAR EL PRIMER BINARIO
  InvComplFstNmbr, //OBTENER COMPLEMENTO EN SENTIDO CONTRARIO (INVERTIR 0s Y 1s)
  IncrSecNmbr, //INCREMENTAR SEGUNDO BINARIO
  ValCarry, //IMPRIMIR EL CARRY
  MoveLeft, //MOVER A LA IZQUIERDA
  Accepted, //ESTADO DE ACEPTACION
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  inputString: string = ''; //CADENA INGRESADA POR EL USUARIO
  tape: string[] = []; //CINTA DE LA MAQUINA
  headPosition: number = 1; //POSICION DEL CABEZAL
  currentStep = ProgramStep.Start;  //ESTADO ACTUAL
  state: string = "Esperando cadena de texto..."; //TEXTO MOSTRADO COMO ESTADO ACTUAL

  //ESCUCHAR Alt+ArrowRight PARA EJECUTAR EL PASO A PASO
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.key === 'ArrowRight') {
      this.DoStep();
      event.preventDefault();
    }
  }
  //PERMITIR SOLAMENTE INGRESO DE 0s, 1s Y UN SOLO ESPACIO
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', ' '];
    const spaceCount = (this.inputString.match(/\s/g) || []).length;
    if ((event.key === ' ' && spaceCount >= 1) || !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  //SEPARACION DE LA CADENA DE TEXTO
  processInput() {
    if (this.inputString === '') {
      alert('Ingrese una cadena de texto');
      return;
    }
    //SE REEMPLAZA EL ESPACIO EN BLANCO POR UNA "B"
    this.tape = ['#', ...this.inputString.split('').map((char) => (char === ' ' ? 'B' : char)), '#'];
    this.headPosition = 1;  //SE INICIALIZA EL CABEZAL
    this.state = "-> Validando que el primer binario no sea 0.";
    this.currentStep = ProgramStep.Start; //SE VUELVE AL ESTADO INICIAL, PARA VERIFICAR SI EL PRIMER BINARIO ES CERO
    this.fstNmbrIsDecr = false; //SE REINICIA LA DECREMENTACION DEL PRIMER BINARIO
    this.secNmbrIsIncr = false; //SE REINICIA LA INCREMENTACION DEL SEGUNDO BINARIO
    this.fstNmbrDigits = []; //SE REINICIAN LOS DIGITOS DEL PRIMER BINARIO
    this.scndNmbrDigits = []; //SE REINICIAN LOS DIGITOS DEL SEGUNDO BINARIO
  }

  fstNmbrIsDecr: boolean = false; //VALIDACION DE QUE EL PRIMER BINARIO SE HA DECREMENTADO
  secNmbrIsIncr: boolean = false; //VALIDACION DE QUE EL SEGUNDO BINARIO SE HA INCREMENTADO
  fstNmbrDigits: string[] = [];  //DIGITOS DEL PRIMER BINARIO
  scndNmbrDigits: string[] = []; //DIGITOS DEL SEGUNDO BINARIO

  DoStep() {
    switch (this.currentStep){
      case ProgramStep.Start:
        if (this.tape[this.headPosition] !== 'B') //MIENTRAS NO SE ENCUENTRE EL VACIO
        {
          this.fstNmbrDigits.push(this.tape[this.headPosition]);  //SE INGRESA EL DIGITO AL ARRAY
          this.headPosition++; //SE DESPLAZA UNA POSICION A LA DERECHA
        }
        else
        {
          if (this.fstNmbrDigits.includes('1')) //SI EL PRIMER BINARIO NO ES CERO
          {
            this.state = "-> El valor del primer binario no es 0. Obteniendo su complemento";
            this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
            this.currentStep = ProgramStep.ComplFstNmbr;  //SE PROCEDE A OBTENER EL COMPLEMENTO
          }
          else  //SI EL PRIMER BINARIO ES CERO
          {
            this.state = "-> El valor del primer binario es 0. Se elimina.";
            this.tape[this.headPosition] = '#';
            this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
            this.currentStep = ProgramStep.FstNmbrZero; //SE PROCEDE A ELIMINAR EL PRIMER BINARIO
          }
        }
      break;
      case ProgramStep.FstNmbrZero:
        if (this.tape[this.headPosition] !== '#') //MIENTRAS NO SE ENCUENTRE EL INICIO DE LA CINTA
        {
          this.tape[this.headPosition] = '#'; //SE REEMPLAZA EL DIGITO POR #
          this.headPosition--; //SE DESPLAZA UNA POSICION A LA IZQUIERDA
        }
        else  //CUANDO SE ENCUENTRE EL INICIO DE LA CINTA
        {
          this.currentStep++; //SE DESPLAZA UNA POSICION A LA DERECHA
          alert("Se ha encontrado el estado de aceptación!");
          this.state = "-> Estado de aceptación encontrado.";
          this.currentStep = ProgramStep.Accepted;  //SE LLEGA ESTADO DE ACEPTACION
        }
      break;
      case ProgramStep.ComplFstNmbr:
        if (this.tape[this.headPosition] !== '#') //MIENTRAS NO SE ENCUENTRE EL INICIO DE LA CINTA
        {
          if (this.tape[this.headPosition] === '0') //SI EL VALOR ES 0
          {
            this.tape[this.headPosition] = '1'; //SE REEMPLAZA POR 1
            this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
          }
          else if (this.tape[this.headPosition] === '1') 
          {
            this.tape[this.headPosition] = '0';
            this.headPosition--;
          }
        }
        else  //CUANDO SE ENCUENTRE EL INICIO DE LA CINTA
        {
          this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
          this.state = "-> Desplazando el cabezal a la derecha.";
          this.currentStep = ProgramStep.MoveRight; //SE PROCEDE A DESPLAZARSE AL FINAL DEL PRIMER BINARIO
        }
      break;
      case ProgramStep.MoveRight:
        //MIENTRAS NO SE ENCUENTRE EL FINAL DEL PRIMER O SEGUNDO BINARIO
        if (this.tape[this.headPosition] !== 'B' && this.tape[this.headPosition] !== '#')
        {
          this.scndNmbrDigits.push(this.tape[this.headPosition]); //SE INGRESA EL DIGITO AL ARRAY
          this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
        }
        else
        {
          if (this.tape[this.headPosition] === 'B') //SI SE ENCUENTRA UNA "B" ES EL FINAL DEL PRIMER BINARIO
          {
            this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
            this.state = "-> Decrementando el primer binario.";
            this.currentStep = ProgramStep.DecrFstNmbr; //SE PROCEDE A DECREMENTAR EL PRIMER BINARIO
          }
          else  //SI SE ENCUENTRA UN "#" ES EL FINAL DEL SEGUNDO BINARIO
          {
            if (!this.scndNmbrDigits.includes("0")) //SI EL SEGUNDO BINARIO ES CERO
            {
              this.tape[this.headPosition] = '0'; //SE REEMPLAZA EL FINAL DE LA CINTA POR UN 0
              this.tape.push('#');  //SE AGREGA UN NUEVO FINAL A LA CINTA
            }
            this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
            this.state = "-> Incrementando el segundo binario.";
            this.currentStep = ProgramStep.IncrSecNmbr; //SE PROCEDE A INCREMENTAR EL SEGUNDO BINARIO
          }
        }
      break;
      case ProgramStep.DecrFstNmbr:
        if (this.tape[this.headPosition] !== '#') //MIENTRAS NO ENCUENTRE EL INICIO DE LA CINTA
        {
          if (!this.fstNmbrIsDecr)  //MIENTRAS EL PRIMER BINARIO NO ESTE DECREMENTADO
          {
            if (this.tape[this.headPosition] === '1') //SI EL DIGITO ES 1
            {
              this.tape[this.headPosition] = '0'; //SE REEMPLAZA POR 0
              this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
            }
            else if (this.tape[this.headPosition] === '0')  //SI EL DIGITO ES 0
            {
              this.tape[this.headPosition] = '1'; //SE REEMPLAZA POR 1
              this.fstNmbrIsDecr = true;  //CUANDO SE REEMPLACE EL PRIMER 0 EL BINARIO ESTA DECREMENTADO
            }
          }
          else
          {
            this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
          }
        }
        else
        {
          this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
          this.state = "-> Obteniendo el complemento de forma inversa.";
          this.currentStep = ProgramStep.InvComplFstNmbr; //SE PROCEDE A OBTENER EL COMPLEMENTO DE FORMA INVERSA
        }
      break;
      case ProgramStep.InvComplFstNmbr:
        if (this.tape[this.headPosition] !== 'B') //MIENTRAS NO SE ENCUENTRE EL FINAL DEL PRIMER BINARIO
        {
          if (this.tape[this.headPosition] === '0') //SI EL DIGITO ES 0
          {
            this.tape[this.headPosition] = '1'; //SE REEMPLAZA POR 1
            this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
          }
          else if (this.tape[this.headPosition] === '1')  //SI EL DIGITO ES 1
          {
            this.tape[this.headPosition] = '0'; //SE REEMPLAZA POR 0
            this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
          }
        }
        else  //SI SE ENCUENTRA EL FINAL DEL PRIMER BINARIO
        {
          this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
          this.scndNmbrDigits = []; //SE LIMPIAN LOS DIGITOS ALMACENADOS DEL SEGUNDO BINARIO ANTERIOR
          this.state = "-> Desplazando el cabezal a la derecha.";
          this.currentStep = ProgramStep.MoveRight; //SE PROCEDE A DESPLAZARSE A LA DERECHA
        }
      break;
      case ProgramStep.IncrSecNmbr:
        if (this.tape[this.headPosition] !== '#') //MIENTRAS NO SE ENCUENTRE EL INICIO DE LA CINTA
        {
          if (!this.secNmbrIsIncr)  //MIENTRAS EL SEGUNDO BINARIO NO ESTE INCREMENTADO
          {
            if (this.tape[this.headPosition] === '1')   //SI EL DIGITO ES 1
            {
              this.tape[this.headPosition] = '0'; //SE REEMPLAZA POR 0
              this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
            } 
            else if (this.tape[this.headPosition] === '0')  //SI EL DIGITO ES 0
            {
              this.tape[this.headPosition] = '1'; //SE REEMPLAZA POR 1
              this.secNmbrIsIncr = true;  //CUANDO SE REEMPLACE EL PRIMER 0 EL BINARIO ESTA INCREMENTADO
            } 
            else if (this.tape[this.headPosition] === 'B')  //SI SE ENCUENTRA UNA B, EL BINARIO AUN NO ESTA INCREMENTADO
            {
              this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
              this.state = "-> Carry detectado, imprimiéndolo. El segundo binario toma una posición más a la derecha.";
              this.currentStep = ProgramStep.ValCarry;  //SE PROCEDE A IMPRIMIR EL CARRY
            }
          }
          else  //SI EL BINARIO YA ESTA INCREMENTADO
          {
            this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
          }
        }
        else  //CUANDO SE ENCUENTRE EL INICIO DE LA CINTA, EL SEGUNDO BINARIO DEBERIA ESTA INCREMENTADO
        {
          this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
          this.state = "-> Validando que el primer binario no sea 0.";
          this.currentStep = ProgramStep.Start; //SE VUELVE AL ESTADO INICIAL, PARA VERIFICAR SI EL PRIMER BINARIO ES CERO
          this.fstNmbrIsDecr = false; //SE REINICIA LA DECREMENTACION DEL PRIMER BINARIO
          this.secNmbrIsIncr = false; //SE REINICIA LA INCREMENTACION DEL SEGUNDO BINARIO
          this.fstNmbrDigits = []; //SE REINICIAN LOS DIGITOS DEL PRIMER BINARIO
          this.scndNmbrDigits = []; //SE REINICIAN LOS DIGITOS DEL SEGUNDO BINARIO
        }
      break;
      case ProgramStep.ValCarry:
        this.tape[this.headPosition] = '1'; //SE REEMPLAZA EL DIGITO POR 1
        this.secNmbrIsIncr = true;  //EL SEGUNDO BINARIO DEBERIA ESTAR INCREMENTADO
        this.headPosition--;  //SE DESPLAZA UNA POSICION A LA IZQUIERDA
        this.state = "-> Desplazando el cabezal a la izquierda.";
        this.currentStep = ProgramStep.MoveLeft;  
      break;
      case ProgramStep.MoveLeft:
        if (this.tape[this.headPosition] !== '#') //MIENTRAS NO SE ENCUENTRE EL INICIO DE LA CINTA 
        {
          this.headPosition--;  //SE DESPLAZA A LA IZQUIERDA
        }
        else  //SI SE ENCUENTRA EL INICIO DE LA CINTA
        {
          this.headPosition++;  //SE DESPLAZA UNA POSICION A LA DERECHA
          this.state = "-> Validando que el primer binario no sea 0.";
          this.currentStep = ProgramStep.Start; //SE VUELVE AL ESTADO INICIAL, PARA VERIFICAR SI EL PRIMER BINARIO ES CERO
          this.fstNmbrIsDecr = false; //SE REINICIA LA DECREMENTACION DEL PRIMER BINARIO
          this.secNmbrIsIncr = false; //SE REINICIA LA INCREMENTACION DEL SEGUNDO BINARIO
          this.fstNmbrDigits = [];  //SE REINICIAN LOS DIGITOS DEL PRIMER BINARIO
          this.scndNmbrDigits = []; //SE REINICIAN LOS DIGITOS DEL SEGUNDO BINARIO
        }
      break;
      case ProgramStep.Accepted:
        alert("Se ha encontrado el estado de aceptación!");
      break;
    }
  }
}
