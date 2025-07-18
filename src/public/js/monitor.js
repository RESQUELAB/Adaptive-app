class Monitor {
    //profileCtrl = new ProfileController();
    //mutateCtrl = new MutationController();
    constructor() {
    }

    muestraUsuario() {
        //let u = this.profileCtrl.profile.userInfo.clientData;
        let u = loginInfo;
        console.log("Usuario actual: ", JSON.stringify(u, null, 2));
    }
    muestraAdaptaciones() {
        let m = mc.mutations;
        const am = mc.all_mutations;
        console.log("Adaptaciones:\n===================================================\nDisponibles: ", JSON.stringify(am, null, 2), "\n\nAplicadas: ", JSON.stringify(m, null, 2));
    }
    muestraPlataforma() {
        let p = pfc.platformInfo;
        pfc.getInfo().then(info => {
            console.log("Información de la plataforma:\n===================================================\n", JSON.stringify(info, null, 2));
        });
    }
}

let monitor = new Monitor();
monitor.muestraUsuario();
monitor.muestraAdaptaciones();
monitor.muestraPlataforma();