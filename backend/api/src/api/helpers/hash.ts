import crypto from 'crypto';

export = new class Hash {
  sha256 = (text: string) => crypto.createHash('sha256').update(text).digest('hex');

  sha512 = (text: string) => crypto.createHash('sha512').update(text).digest('hex');

  generate_random_string(length: Number, generateMode = 0) {
    let characters;
    if (generateMode === 0) characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@&#>{@}][|/()!_:?,.-;';
    else if (generateMode === 1) characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    else if (generateMode === 2) characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    else characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let output = '';
    for (let i = 0; i < length; i++)
        output += characters[Math.floor(Math.random() * (characters.length - 1))];

    return output;
  }

  generate_salt = () => (new Hash).generate_random_string(5);

  generate_pepper = () => (new Hash).generate_random_string(1, 3);

  get_pepper(firstValue: string, secondValue: string) {
      const pepper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let output = false;
      pepper.split('').forEach(character => {
          if ((new Hash).sha256(firstValue + character) === secondValue) output = true;
      });
      return output;
  }
}
