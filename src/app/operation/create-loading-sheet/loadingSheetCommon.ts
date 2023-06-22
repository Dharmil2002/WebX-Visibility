export function transform(value: any, param: string): string {
    const parts = value.split(': ')[1].split('-');
    const index = parts.indexOf(param);

    if (index !== -1) {
      return parts.slice(index).join('-');
    }

    return '';
  
  }