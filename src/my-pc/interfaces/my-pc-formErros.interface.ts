export interface MyPcFormErros {
  nombre: string[];
  descripcion: string[];
  file: string[];
  everyone: string[];
}

export interface MyPcFormErrosHbs {
  message: {
    nombre: string[];
    descripcion: string[];
    file: string[];
    everyone: string[];
  };
}
