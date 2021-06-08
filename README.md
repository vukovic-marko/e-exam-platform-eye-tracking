<br />
<p align="center">
  <h3 align="center">Veb platforma za ocenjivanje znanja uz praćenje pokreta oka</h3>

  <p align="center">
    Veb platforma za ocenjivanje znanja uz praćenje pokreta oka, implementirana u okviru projekta na predmetu Savremene obrazovne tehnologije i standardi.
    <br />
    <br />
    Marko Vuković E2 18/2019
    <br />
    <a href="https://github.com/vukovic-marko/projekat-sotis/blob/master/paper/Paper.pdf"><strong>Rad »</strong></a>
    <br />
    <br />
    <a href="https://github.com/vukovic-marko/projekat-sotis/tree/master/frontend">Klijentska aplikacija</a>
    ·
    <a href="https://github.com/vukovic-marko/projekat-sotis/tree/master/backend">Serverska aplikacija</a>
    ·
    <a href="https://github.com/vukovic-marko/projekat-sotis/blob/master/proposal/Proposal.pdf">Predlog projekta</a>
  </p>
</p>

<details open="open">
  <summary><h2 style="display: inline-block">Sadržaj</h2></summary>
  <ol>
    <li>
      <a href="#o-projektu">O projektu</a>
      <ul>
        <li><a href="#korišćene-tehnologije">Korišćene tehnologije</a></li>
      </ul>
    </li>
    <li>
      <a href="#uputstvo-za-instalaciju">Uputstvo za instalaciju</a>
      <ul>
        <li><a href="#potreban-softver">Potreban softver</a></li>
        <li><a href="#pokretanje">Pokretanje</a></li>
      </ul>
    </li>
    <li>
      <a href="#konfigurisanje">Konfigurisanje</a>
    </li>
  </ol>
</details>

## O projektu

Veb platforma za ocenjivanje znanja uz praćenje pokreta oka.

### Korišćene tehnologije

* [Skup tehnologija MERN (MongoDB, Express.js, ReactJS, Node.js)](https://www.mongodb.com/mern-stack)
* [Softver za praćenje pokreta oka GazePointer](https://gazerecorder.com/gazepointer/)

<!-- GETTING STARTED -->
## Uputstvo za instalaciju

Potrebno je instalirati nephodan softver i ispratiti sledeće korake.

### Potreban softver

* [Node.js i NPM](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/lang/en/)
  ```sh
   npm install --global yarn
  ```
* [MongoDB Community Server](https://www.mongodb.com/try/download/community)
* [GazePointer](https://gazerecorder.com/gazepointer/)

### Pokretanje

1. Klonirati repozitorijum.
    ```sh
    git clone https://github.com/vukovic-marko/projekat-sotis.git
    ```
2. Pozicionirati se u folder sa serverskom aplikacijom.
    ```sh
    cd projekat-sotis/backend
    ```
3. Instalirati potrebne pakete.
    ```sh
    yarn
    ```
4. Kreirati .env fajl i postaviti promenljive okruženja. Primer .env fajla dat je u narednoj sekciji.
5. Pokrenuti serversku aplikaciju
    ```sh
    yarn start
    ```
6. Otvoriti novu instancu komandne linije i pozicionirati se u folder klijentske aplikacije.
    ```sh
    cd projekat-sotis/frontend
   ```
7. Instalirati potrebne pakete.
    ```sh
    yarn
    ```
8. Pokrenuti klijentsku aplikaciju.
    ```sh
    yarn start
    ```
9. Pokrenuti softver GazePointer.
10. Platforma je spremna za korišćenje i dostupna na putanji [http://localhost:3000](http://localhost:3000).
  
## Konfigurisanje

Moguće je konfigurisati ponašanje serverske aplikacije korišćenjem promenljivih okruženja. Moguće je definisati:
 
 <ul>
  <li>
    PORT - port na kome se serverska aplikacija pokreće,
  </li>
  <li>
    DB_CONNECTION - lokaciju i informacije o bazi podataka,
  </li>
  <li>
    ACCESS_TOKEN_SECRET - šifru za potpisivanje tokena za pristup resursima,
  </li>
  <li>
    ACCESS_TOKEN_EXPIRES_IN - životni vek tokena za pristup resursima,
  </li>
  <li>
    REFRESH_TOKEN_SECRET - šifru za potpisivanje tokena za osvežavanje tokena za pristup resursima i
  </li>
  <li>
    REFRESH_TOKEN_EXPIRES_IN - životni vek tokena za osvežavanje tokena za pristup resursima.
  </li>
 </ul>

Jedan od načina za definisanje ovih promenljivih je kreiranjem .env fajla u korenskom folderu serverske aplikacije. U nastavku je dat primer .env fajla.

    PORT=5000
    DB_CONNECTION=mongodb://dbUser:dbPass@localhost:27017/test
    ACCESS_TOKEN_SECRET=QnaXFnbREkmQ65SvS/k3dkF1WuwDVbpVmJDW2Sd0nTr+AgX2c18EVpn5B/D/if4WWbG/Gl3AfSVqYAO1JlZQB3jUUMfPuF+FXQhHyp7DpsG4XqjCVZTtdamdlgBPTSdpQoirkQRG6t+5zT92KOPS+ffvPyLwtwYe1yG2PZrXoTxCWLDgfnzt9UapXUGIf757C5lEoUgPtPOYgGmjlzlKUKQ8RsbqtGBMxDIhh0nxbofAhkf4zSYm24DciwqaT+eUtP9+8/+7MrHHS6KFOiTwQpJ0jQ4Jl75+WyZrhxn+lWTweZ0QHU6pyOE/hJ76MFeg3Heto5uDUS0JcDPRs27+jQ==
    REFRESH_TOKEN_SECRET=3ZHu5PfIbegwphGB4vPBlFA4hg9ofvmVcCKKQJJ9UgEjHdU4Xhhhko4nQPySiYjkOUXJ7dKhHtcLBM3kydhBnrnt6k884ikHQgI7Rq7MJveMwqfzi426p9nivpCmIpy2GoRURAGTshTLsk+0vQpEnmmjPNg5pK1hEHwqO7EhpcUpuxmgPXGfStfORsh11vvOyyBdySWQUDSHR25Th2/opYf8EtUYo8qq6pOa3ojnSor+akEVIldCOqSHssFgUb+avwrpgf2xpvUHxc1Mfop+9GQpj+m0bceBEv4jMbxcJGByPcC/aTsiWHrPg0HbDUcWiyBM3BaVD5v/uClChtcqmQ==
    ACCESS_TOKEN_EXPIRES_IN=20m
    REFRESH_TOKEN_EXPIRES_IN=7d
