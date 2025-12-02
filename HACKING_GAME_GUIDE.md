# Hacking Game - Complete Guide

## Level 1: Terminal Navigation ✅ (You completed this!)

**Challenge:** Find the hidden file in the system

**How it works:**
- You need to use terminal/command-line commands
- The game accepts commands like: `ls`, `ls -la`, `find . -name secret.txt`, `cat secret.txt`
- These simulate navigating a file system to find a hidden file

**Commands explained:**
- `ls` - Lists files in current directory
- `ls -la` - Lists all files including hidden ones
- `find . -name secret.txt` - Searches for a file named "secret.txt"
- `cat secret.txt` - Displays the contents of the file

---

## Level 1: Caesar Cipher 🔐

command - ls

---

## Level 2: Caesar Cipher 🔐

**Challenge:** Decode "KHOOR ZRUOG" (Caesar cipher with shift 3)

**How Caesar Cipher Works:**
- Each letter is shifted by a certain number of positions in the alphabet
- Shift 3 means: A→D, B→E, C→F, D→G, etc.
- To decode, shift BACKWARDS by 3

**Step-by-step solution:**
```
K → shift back 3 → H
H → shift back 3 → E
O → shift back 3 → L
O → shift back 3 → L
R → shift back 3 → O
(space stays space)
Z → shift back 3 → W
R → shift back 3 → O
U → shift back 3 → R
O → shift back 3 → L
G → shift back 3 → D
```

**Answer:** `HELLO WORLD`

**How to solve manually:**
1. Write the alphabet: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
2. For each letter in "KHOOR ZRUOG", find it in the alphabet
3. Count 3 positions to the LEFT (backwards)
4. K is at position 11, go back 3 → position 8 = H
5. Continue for all letters

**Quick trick:** 
- If you know it's shift 3, just subtract 3 from each letter's position
- Or use an online Caesar cipher decoder

---

## Level 3: Base64 Decoding 📝

**Challenge:** Decode "U0tJTEw="

**How Base64 Works:**
- Base64 is an encoding method that converts binary data to text
- Uses 64 characters: A-Z, a-z, 0-9, +, /
- `=` is padding

**How to solve:**
1. **Online tool:** Use a Base64 decoder (search "base64 decode online")
2. **JavaScript:** Use `atob("U0tJTEw=")` in browser console
3. **Manual:** Each character represents 6 bits, decode to binary, then to ASCII

**Answer:** `SKILL`

**Quick solution:**
- Copy "U0tJTEw="
- Paste into any Base64 decoder
- Get: "SKILL"

---

## Level 4: Password Cracking 🔑

**Challenge:** Crack SHA-256 hash: `5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`

**How SHA-256 Works:**
- SHA-256 is a cryptographic hash function
- Same input always produces same hash
- One-way function (can't reverse, but can try common passwords)

**How to solve:**
1. Try common passwords and hash them
2. Common passwords to try:
   - "password" → matches this hash! ✅
   - "admin"
   - "123456"
   - "qwerty"

**Answer:** `password`

**How to verify:**
- Use online SHA-256 generator
- Type "password" → get the hash
- Compare with the given hash

**Tools:**
- Online SHA-256 hash generator
- Or try common password lists

---

## Level 5: Hex to ASCII 🔢

**Challenge:** Convert "4861636b6572" to ASCII text

**How Hex to ASCII Works:**
- Hexadecimal (hex) uses 0-9 and A-F
- Each pair of hex digits = one ASCII character
- Example: 48 (hex) = 72 (decimal) = 'H' (ASCII)

**Step-by-step:**
```
48 = 4×16 + 8 = 72 = 'H'
61 = 6×16 + 1 = 97 = 'a'
63 = 6×16 + 3 = 99 = 'c'
6b = 6×16 + 11 = 107 = 'k'
65 = 6×16 + 5 = 101 = 'e'
72 = 7×16 + 2 = 114 = 'r'
```

**Answer:** `Hacker`

**How to solve:**
1. Split into pairs: 48 61 63 6b 65 72
2. Convert each pair to decimal
3. Convert decimal to ASCII character
4. Or use online hex to ASCII converter

**Quick solution:**
- Use online tool: "hex to ascii converter"
- Paste "4861636b6572"
- Get: "Hacker"

---

## Level 6: Final Challenge 🎯

**Challenge:** Multi-step challenge combining all skills

**Step 1:** Decode base64: "RmluZCB0aGUgc2VjcmV0"
- Decode: "Find the secret"

**Step 2:** Use terminal command
- The decoded message says "Find the secret"
- Use: `find . -name secret` or `find . -name secret.txt`

**Step 3:** Read the file
- Use: `cat secret` or just type the final flag

**Answer:** `FLAG_COMPLETE`

**Or directly:** You can also just type `FLAG_COMPLETE` to complete the level

---

## Tips & Tricks 💡

### For Caesar Cipher:
- Use online Caesar cipher decoder
- Or manually shift each letter backwards by 3
- Remember: A=1, B=2, C=3... Z=26

### For Base64:
- Always ends with `=` or `==` (padding)
- Use `atob()` in browser console
- Or online Base64 decoder

### For SHA-256:
- Try common passwords first
- Use online SHA-256 hash generator to verify
- Common passwords: password, admin, 123456, qwerty, letmein

### For Hex:
- Split into pairs of 2 characters
- Convert each pair to decimal, then to ASCII
- Use online hex to ASCII converter

### General:
- Use hints if stuck (click [TOGGLE_HINT])
- Fewer attempts = higher score
- Achievements unlock as you progress

---

## Online Tools You Can Use 🔧

1. **Caesar Cipher:** https://cryptii.com/pipes/caesar-cipher
2. **Base64 Decoder:** https://www.base64decode.org/
3. **SHA-256 Hash:** https://emn178.github.io/online-tools/sha256.html
4. **Hex to ASCII:** https://www.rapidtables.com/convert/number/hex-to-ascii.html

---

## Practice Examples 🎓

### Caesar Cipher Practice:
- "IFMMP XPSME" (shift 1) = ?
- Answer: "HELLO WORLD"

### Base64 Practice:
- "SGVsbG8=" = ?
- Answer: "Hello"

### Hex Practice:
- "48656C6C6F" = ?
- Answer: "Hello"

Good luck hacking! 🚀

