# NCTB Secondary Mathematics Benchmark Test Suite (All 17 Chapters)
This benchmark test suite is derived directly from the authentic physical pages of the NCTB Secondary Mathematics Textbook (`mathematics_en.pdf` & `mathematics_bn.pdf`).
Each question tests core theoretical understanding, problem solving, proofs, or formula applications corresponding to NCTB curriculum standards.

---

## Chapter 1: Real Numbers (বাস্তব সংখ্যা)
- **Textbook Page**: Page 8, Section 1.3 (Proof of Irrationality)
- **Question**: Prove that $\sqrt{2}$ is an irrational number.
- **Expected Output**:
  - Assume the contrary: $\sqrt{2}$ is a rational number.
  - Then $\sqrt{2} = \frac{p}{q}$, where $p$ and $q$ are co-prime positive integers and $q > 1$.
  - Squaring both sides: $2 = \frac{p^2}{q^2} \implies 2q = \frac{p^2}{q}$.
  - Clearly $2q$ is an integer because $q$ is an integer.
  - But $\frac{p^2}{q}$ is not an integer because $p$ and $q$ are co-prime and $q > 1$ (they share no common factors).
  - Therefore, $2q \neq \frac{p^2}{q}$, which contradicts our assumption that $2q = \frac{p^2}{q}$.
  - Hence, $\sqrt{2}$ cannot be expressed in the form $\frac{p}{q}$.
  - Conclusion: $\sqrt{2}$ is an irrational number.

---

## Chapter 2: Sets and Functions (সেট ও ফাংশন)
- **Textbook Page**: Page 28, Section 2.1 (Power Sets)
- **Question**: If set $A = \{a, b, c\}$, determine the power set $P(A)$ and show that the number of elements of $P(A)$ satisfies $2^n$, where $n$ is the number of elements of $A$.
- **Expected Output**:
  - Given $A = \{a, b, c\}$, the number of elements $n = 3$.
  - The subsets of $A$ are:
    - Subsets with 3 elements: $\{a, b, c\}$
    - Subsets with 2 elements: $\{a, b\}, \{a, c\}, \{b, c\}$
    - Subsets with 1 element: $\{a\}, \{b\}, \{c\}$
    - Subset with 0 elements: $\emptyset$
  - Therefore, $P(A) = \{\{a, b, c\}, \{a, b\}, \{a, c\}, \{b, c\}, \{a\}, \{b\}, \{c\}, \emptyset\}$.
  - Total number of elements in $P(A) = 8$.
  - Since $8 = 2^3 = 2^n$, the number of elements of $P(A)$ satisfies $2^n$.

---

## Chapter 3: Algebraic Expressions (বীজগাণিতিক রাশি)
- **Textbook Page**: Page 51, Exercise 3.2, Problem 7 / Example
- **Question**: If $x - \frac{1}{x} = 4$, find the value of $x^3 - \frac{1}{x^3}$.
- **Expected Output**:
  - Use the algebraic identity: $a^3 - b^3 = (a - b)^3 + 3ab(a - b)$.
  - Here $a = x$ and $b = \frac{1}{x}$.
  - $x^3 - \frac{1}{x^3} = \left(x - \frac{1}{x}\right)^3 + 3 \cdot x \cdot \frac{1}{x} \left(x - \frac{1}{x}\right)$.
  - Substitute $x - \frac{1}{x} = 4$:
  - $x^3 - \frac{1}{x^3} = (4)^3 + 3(1)(4) = 64 + 12 = 76$.
  - Final Answer: $76$.

---

## Chapter 4: Exponents and Logarithms (সূচক ও লগারিদম)
- **Textbook Page**: Page 86, Exercise 4.2, Problem 4(a)
- **Question**: Simplify the logarithmic expression: $\log_{10}\left(\frac{75}{16}\right) - 2\log_{10}\left(\frac{5}{9}\right) + \log_{10}\left(\frac{32}{243}\right)$.
- **Expected Output**:
  - Express all numbers in terms of prime factors ($2, 3, 5$):
    - $75 = 3 \cdot 5^2$, $16 = 2^4$
    - $5 = 5$, $9 = 3^2$
    - $32 = 2^5$, $243 = 3^5$
  - Apply the power law $m \log a = \log(a^m)$:
    - $2\log_{10}\left(\frac{5}{9}\right) = \log_{10}\left(\left(\frac{5}{9}\right)^2\right) = \log_{10}\left(\frac{25}{81}\right) = \log_{10}\left(\frac{5^2}{3^4}\right)$
  - Combine using $\log A - \log B + \log C = \log\left(\frac{A \cdot C}{B}\right)$:
    - $\log_{10}\left( \frac{\frac{3 \cdot 5^2}{2^4} \cdot \frac{2^5}{3^5}}{\frac{5^2}{3^4}} \right)$
    - $= \log_{10}\left( \frac{3 \cdot 5^2 \cdot 2^5 \cdot 3^4}{2^4 \cdot 3^5 \cdot 5^2} \right)$
    - Simplify powers:
      - Powers of 2: $2^{5-4} = 2^1 = 2$
      - Powers of 3: $3^{1+4-5} = 3^0 = 1$
      - Powers of 5: $5^{2-2} = 5^0 = 1$
    - The expression reduces to $\log_{10}(2)$.
  - Final Answer: $\log_{10}(2)$.

---

## Chapter 5: Equations in One Variable (এক চলকবিশিষ্ট সমীকরণ)
- **Textbook Page**: Page 100, Exercise 5.1, Problem 12
- **Question**: Solve for $x$: $\frac{x - a}{b} + \frac{x - b}{a} + \frac{x - 3a - 3b}{a + b} = 0$.
- **Expected Output**:
  - Rearrange by splitting the third term or subtracting 1 from each term:
    - $\left(\frac{x - a}{b} - 1\right) + \left(\frac{x - b}{a} - 1\right) + \left(\frac{x - 3a - 3b}{a + b} + 2\right) = 0$
    - Term 1: $\frac{x - a - b}{b}$
    - Term 2: $\frac{x - b - a}{a} = \frac{x - a - b}{a}$
    - Term 3: $\frac{x - 3a - 3b + 2(a + b)}{a + b} = \frac{x - 3a - 3b + 2a + 2b}{a + b} = \frac{x - a - b}{a + b}$
  - Factor out $(x - a - b)$:
    - $(x - a - b) \left( \frac{1}{b} + \frac{1}{a} + \frac{1}{a + b} \right) = 0$
  - Since $a, b > 0$, $\left( \frac{1}{b} + \frac{1}{a} + \frac{1}{a + b} \right) \neq 0$.
  - Therefore, $x - a - b = 0 \implies x = a + b$.
  - Final Answer: $x = a + b$.

---

## Chapter 6: Lines, Angles and Triangles (রেখা, কোণ ও ত্রিভুজ)
- **Textbook Page**: Page 128, Theorem 7
- **Question**: Prove that the sum of the three angles of any triangle is equal to two right angles ($180^\circ$).
- **Expected Output**:
  - Given: $\triangle ABC$. We need to prove $\angle A + \angle B + \angle C = 2 \text{ right angles } (180^\circ)$.
  - Construction: Extend side $BC$ to $D$. Through vertex $C$, draw a line $CE$ parallel to $BA$ ($CE \parallel BA$).
  - Proof:
    1. Since $BA \parallel CE$ and transversal $AC$ intersects them, the alternate angles are equal:
       $\angle BAC = \angle ACE$  ...(1)
    2. Since $BA \parallel CE$ and transversal $BD$ intersects them, the corresponding angles are equal:
       $\angle ABC = \angle ECD$  ...(2)
    3. Adding (1) and (2):
       $\angle BAC + \angle ABC = \angle ACE + \angle ECD = \angle ACD$.
    4. Adding $\angle ACB$ to both sides:
       $\angle BAC + \angle ABC + \angle ACB = \angle ACD + \angle ACB$.
    5. Since $BD$ is a straight line, $\angle ACD + \angle ACB = \angle BCD = 180^\circ$ (a straight angle / 2 right angles).
  - Conclusion: $\angle A + \angle B + \angle C = 180^\circ$ (two right angles).

---

## Chapter 7: Practical Geometry (ব্যবহারিক জ্যামিতি)
- **Textbook Page**: Page 138, Construction 1
- **Question**: State the general enunciation and step-by-step method of construction for constructing a triangle given the base $a$, an angle adjacent to the base $\angle x$, and the sum of the other two sides $s$.
- **Expected Output**:
  - General Enunciation: To construct a triangle given its base $a$, an adjacent angle $\angle x$, and the sum of the other two sides $s$.
  - Steps of Construction:
    1. From any ray $BE$, cut off a segment $BC = a$ equal to the given base.
    2. At point $B$ of the line segment $BC$, construct an angle $\angle CBF = \angle x$.
    3. From the ray $BF$, cut off a line segment $BD = s$ equal to the sum of the two sides.
    4. Join $C, D$.
    5. At point $C$, draw an angle $\angle DC A = \angle BDC$ on the side of $CD$ containing $B$, such that ray $CA$ intersects $BD$ at point $A$.
  - Verification: In $\triangle ACD$, since $\angle ACD = \angle ADC$, we have $AC = AD$. Now $BD = BA + AD = BA + AC = s$. Thus $\triangle ABC$ is the required triangle.

---

## Chapter 8: Circle (বৃত্ত)
- **Textbook Page**: Page 157, Theorem 20
- **Question**: Prove that the angle subtended by an arc of a circle at the centre is double the angle subtended by it at any point on the remaining part of the circle (i.e. $\angle BOC = 2\angle BAC$).
- **Expected Output**:
  - Given: In a circle with centre $O$, arc $BC$ subtends central angle $\angle BOC$ and inscribed angle $\angle BAC$ on the remaining circumference.
  - Construction: Draw diameter $AD$ through $A$ passing through centre $O$.
  - Proof:
    1. In $\triangle AOB$, sides $OA = OB$ (radii of the same circle).
       Therefore, $\angle OAB = \angle OBA$.
    2. The exterior angle $\angle BOD = \angle OAB + \angle OBA = 2\angle OAB$  ...(1)
    3. Similarly, in $\triangle AOC$, $OA = OC$, so exterior angle $\angle COD = \angle OAC + \angle OCA = 2\angle OAC$  ...(2)
    4. Adding (1) and (2):
       $\angle BOD + \angle COD = 2\angle OAB + 2\angle OAC = 2(\angle OAB + \angle OAC)$
       $\implies \angle BOC = 2\angle BAC$.
  - Conclusion: The angle subtended at the centre is twice the angle subtended at the circumference.

---

## Chapter 9: Trigonometric Ratio (ত্রিকোণমিতিক অনুপাত)
- **Textbook Page**: Page 182, Exercise 9.1, Problem 12
- **Question**: Prove the trigonometric identity: $\frac{\csc A}{\csc A - 1} + \frac{\csc A}{\csc A + 1} = 2\sec^2 A$.
- **Expected Output**:
  - LHS:
    $\frac{\csc A}{\csc A - 1} + \frac{\csc A}{\csc A + 1}$
  - Take the common denominator:
    $= \frac{\csc A(\csc A + 1) + \csc A(\csc A - 1)}{(\csc A - 1)(\csc A + 1)}$
    $= \frac{\csc^2 A + \csc A + \csc^2 A - \csc A}{\csc^2 A - 1}$
    $= \frac{2\csc^2 A}{\csc^2 A - 1}$
  - Use the fundamental trigonometric identity $\csc^2 A - 1 = \cot^2 A$:
    $= \frac{2\csc^2 A}{\cot^2 A}$
  - Convert into sine and cosine:
    $= \frac{2 \cdot \frac{1}{\sin^2 A}}{\frac{\cos^2 A}{\sin^2 A}} = 2 \cdot \frac{1}{\sin^2 A} \cdot \frac{\sin^2 A}{\cos^2 A} = \frac{2}{\cos^2 A} = 2\sec^2 A$.
  - LHS = RHS. (Proved)

---

## Chapter 10: Distance and Elevation (দূরত্ব ও উচ্চতা)
- **Textbook Page**: Page 200, Exercise 10, Problem 11
- **Question**: A ladder of length 18 metres leans against a vertical wall and makes an angle of elevation of $45^\circ$ with the ground. Find the height of the wall reached by the ladder.
- **Expected Output**:
  - Let $AB = h$ be the height of the wall reached by the top of the ladder.
  - Length of the ladder $AC = 18\text{ m}$.
  - Angle of elevation $\angle ACB = 45^\circ$.
  - The triangle formed $\triangle ABC$ is a right-angled triangle with $\angle B = 90^\circ$.
  - In $\triangle ABC$:
    $\sin 45^\circ = \frac{\text{opposite}}{\text{hypotenuse}} = \frac{AB}{AC} = \frac{h}{18}$.
  - Since $\sin 45^\circ = \frac{1}{\sqrt{2}}$:
    $\frac{1}{\sqrt{2}} = \frac{h}{18} \implies h = \frac{18}{\sqrt{2}} = 9\sqrt{2}\text{ m}$.
  - Calculating numerical value:
    $h = 9 \times 1.4142 = 12.728\text{ metres} \approx 12.73\text{ metres}$.
  - Final Answer: $9\sqrt{2}\text{ m}$ (or $\approx 12.73\text{ m}$).

---

## Chapter 11: Algebraic Ratio and Proportion (বীজগাণিতিক অনুপাত ও সমানুপাত)
- **Textbook Page**: Page 215, Exercise 11.1, Problem 7(b)
- **Question**: If $\frac{a}{b} = \frac{b}{c} = \frac{c}{d}$, prove that $(a^2 + b^2 + c^2)(b^2 + c^2 + d^2) = (ab + bc + cd)^2$.
- **Expected Output**:
  - Let $\frac{a}{b} = \frac{b}{c} = \frac{c}{d} = k$.
  - Then:
    - $c = dk$
    - $b = ck = (dk)k = dk^2$
    - $a = bk = (dk^2)k = dk^3$
  - LHS:
    $(a^2 + b^2 + c^2)(b^2 + c^2 + d^2)$
    $= ((dk^3)^2 + (dk^2)^2 + (dk)^2)((dk^2)^2 + (dk)^2 + d^2)$
    $= (d^2 k^6 + d^2 k^4 + d^2 k^2)(d^2 k^4 + d^2 k^2 + d^2)$
    $= d^2 k^2 (k^4 + k^2 + 1) \cdot d^2 (k^4 + k^2 + 1)$
    $= d^4 k^2 (k^4 + k^2 + 1)^2$.
  - RHS:
    $(ab + bc + cd)^2$
    $= ((dk^3)(dk^2) + (dk^2)(dk) + (dk)(d))^2$
    $= (d^2 k^5 + d^2 k^3 + d^2 k)^2$
    $= [d^2 k (k^4 + k^2 + 1)]^2$
    $= d^4 k^2 (k^4 + k^2 + 1)^2$.
  - Since LHS = RHS, the identity is proved.

---

## Chapter 12: Simple Simultaneous Equations in Two Variables (দুই চলকবিশিষ্ট সরল সহসমীকরণ)
- **Textbook Page**: Page 235, Exercise 12.2, Problem 10
- **Question**: Solve the system of equations by the method of cross-multiplication:
  $6x - y = 1$
  $3x + 2y = 13$
- **Expected Output**:
  - Rewrite equations in standard form $a x + b y + c = 0$:
    $6x - y - 1 = 0$  (here $a_1 = 6, b_1 = -1, c_1 = -1$)
    $3x + 2y - 13 = 0$ (here $a_2 = 3, b_2 = 2, c_2 = -13$)
  - Using the formula of cross-multiplication:
    $\frac{x}{b_1 c_2 - b_2 c_1} = \frac{y}{c_1 a_2 - c_2 a_1} = \frac{1}{a_1 b_2 - a_2 b_1}$
  - Calculate denominators:
    - For $x$: $(-1)(-13) - (2)(-1) = 13 + 2 = 15$
    - For $y$: $(-1)(3) - (-13)(6) = -3 + 78 = 75$
    - Constant: $(6)(2) - (3)(-1) = 12 + 3 = 15$
  - Thus:
    $\frac{x}{15} = \frac{y}{75} = \frac{1}{15}$
  - Solving for $x$ and $y$:
    $x = \frac{15}{15} = 1$
    $y = \frac{75}{15} = 5$
  - Final Answer: $(x, y) = (1, 5)$.

---

## Chapter 13: Finite Series (সসীম ধারা)
- **Textbook Page**: Page 254, Exercise 13.1, Problem 8 / Example
- **Question**: Find the sum of the series: $1 + 3 + 5 + 7 + \dots + 19$.
- **Expected Output**:
  - The given series is an arithmetic progression where:
    - First term $a = 1$
    - Common difference $d = 3 - 1 = 2$
    - Last term $p = 19$
  - Find number of terms $n$:
    - $a + (n - 1)d = 19 \implies 1 + (n - 1)2 = 19$
    - $2(n - 1) = 18 \implies n - 1 = 9 \implies n = 10$.
  - Formula for the sum of $n$ terms:
    - $S_n = \frac{n}{2}[2a + (n - 1)d]$ or $S_n = \frac{n}{2}[a + l]$
    - $S_{10} = \frac{10}{2}[1 + 19] = 5 \times 20 = 100$.
    - Alternatively: Sum of first $n$ odd natural numbers is $n^2 = 10^2 = 100$.
  - Final Answer: $100$.

---

## Chapter 14: Ratio, Similarity and Symmetry (অনুপাত, সদৃশতা ও প্রতিসাম্য)
- **Textbook Page**: Page 268, Theorem 28 (Thales' Theorem)
- **Question**: State and prove Thales' Theorem (A line drawn parallel to one side of a triangle intersects the other two sides or their extended lines in the same ratio).
- **Expected Output**:
  - Statement: If a line is drawn parallel to one side of a triangle, it divides the other two sides in the same ratio.
  - Given: In $\triangle ABC$, line $DE$ is parallel to side $BC$ and intersects $AB$ at $D$ and $AC$ at $E$.
  - To Prove: $\frac{AD}{DB} = \frac{AE}{EC}$.
  - Construction: Join $B, E$ and $C, D$. Draw perpendiculars $DM \perp AC$ and $EN \perp AB$.
  - Proof:
    1. Area of $\triangle ADE = \frac{1}{2} \times AD \times EN$
    2. Area of $\triangle BDE = \frac{1}{2} \times DB \times EN$
       $\implies \frac{\text{Area}(\triangle ADE)}{\text{Area}(\triangle BDE)} = \frac{AD}{DB}$  ...(1)
    3. Area of $\triangle ADE = \frac{1}{2} \times AE \times DM$
    4. Area of $\triangle CDE = \frac{1}{2} \times EC \times DM$
       $\implies \frac{\text{Area}(\triangle ADE)}{\text{Area}(\triangle CDE)} = \frac{AE}{EC}$  ...(2)
    5. But $\triangle BDE$ and $\triangle CDE$ stand on the same base $DE$ and lie between the same parallel lines $DE$ and $BC$.
       Therefore, $\text{Area}(\triangle BDE) = \text{Area}(\triangle CDE)$.
    6. Comparing (1) and (2): $\frac{AD}{DB} = \frac{AE}{EC}$.
  - Conclusion: $\frac{AD}{DB} = \frac{AE}{EC}$ (Proved).

---

## Chapter 15: Area Related Theorems and Constructions (ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য)
- **Textbook Page**: Page 287, Theorem 33 (Pythagoras' Theorem)
- **Question**: State Pythagoras' Theorem and prove it using similar right-angled triangles.
- **Expected Output**:
  - Statement: In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.
  - Given: In $\triangle ABC$, $\angle B = 90^\circ$, hypotenuse is $AC$. To prove: $AC^2 = AB^2 + BC^2$.
  - Construction: Draw perpendicular $BD$ from $B$ to hypotenuse $AC$ ($BD \perp AC$).
  - Proof:
    1. Compare $\triangle ABD$ and $\triangle ABC$:
       - $\angle ADB = \angle ABC = 90^\circ$
       - $\angle BAD = \angle BAC$ (common angle)
       - Therefore, $\triangle ABD \sim \triangle ABC$ (equiangular and similar).
       - Ratio of corresponding sides: $\frac{AB}{AC} = \frac{AD}{AB} \implies AB^2 = AC \times AD$  ...(1)
    2. Compare $\triangle BCD$ and $\triangle ABC$:
       - $\angle BDC = \angle ABC = 90^\circ$
       - $\angle BCD = \angle BCA$ (common angle)
       - Therefore, $\triangle BCD \sim \triangle ABC$.
       - Ratio of corresponding sides: $\frac{BC}{AC} = \frac{DC}{BC} \implies BC^2 = AC \times DC$  ...(2)
    3. Adding equations (1) and (2):
       $AB^2 + BC^2 = AC \times AD + AC \times DC = AC(AD + DC)$.
    4. Since $D$ lies on segment $AC$, $AD + DC = AC$.
       $AB^2 + BC^2 = AC \times AC = AC^2$.
  - Conclusion: $AC^2 = AB^2 + BC^2$. (Proved)

---

## Chapter 16: Mensuration (পরিমিতি)
- **Textbook Page**: Page 317, Section 16.4, Problem / Example on Cylinder
- **Question**: The radius of the base of a right circular cylinder is $7\text{ cm}$ and its height is $10\text{ cm}$. Find its curved surface area, total surface area, and volume (take $\pi = \frac{22}{7}$).
- **Expected Output**:
  - Given:
    - Base radius $r = 7\text{ cm}$
    - Height $h = 10\text{ cm}$
    - $\pi = \frac{22}{7}$
  - Formulas:
    1. Curved Surface Area (CSA) $= 2\pi r h$
       $= 2 \times \frac{22}{7} \times 7 \times 10 = 2 \times 22 \times 10 = 440\text{ cm}^2$.
    2. Total Surface Area (TSA) $= 2\pi r (r + h)$
       $= 2 \times \frac{22}{7} \times 7 \times (7 + 10) = 44 \times 17 = 748\text{ cm}^2$.
    3. Volume ($V$) $= \pi r^2 h$
       $= \frac{22}{7} \times 7^2 \times 10 = 22 \times 7 \times 10 = 1540\text{ cm}^3$.
  - Final Answers:
    - Curved Surface Area $= 440\text{ cm}^2$
    - Total Surface Area $= 748\text{ cm}^2$
    - Volume $= 1540\text{ cm}^3$

---

## Chapter 17: Statistics (পরিসংখ্যান)
- **Textbook Page**: Page 336, Section 17.5 (Median of Grouped Data)
- **Question**: State the formula for determining the median of grouped frequency distribution data according to the NCTB curriculum and define all the variables ($L$, $n$, $F_c$, $f_m$, $h$).
- **Expected Output**:
  - Formula:
    $$\text{Median} = L + \left( \frac{n}{2} - F_c \right) \times \frac{h}{f_m}$$
  - Definitions of the variables:
    - $L$: Lower limit of the median class.
    - $n$: Total frequency (total number of observations).
    - $F_c$: Cumulative frequency of the class preceding (previous to) the median class.
    - $f_m$: Frequency of the median class.
    - $h$: Class interval (width/size) of the median class.
