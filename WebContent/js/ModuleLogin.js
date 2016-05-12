/**
 * Classe responsavel por fazer a conexao do sevidor (ApontamentoGeopx-Server) com o Cliente (ApontamentoGeopx-Cliente)
 * Dessa forma interagir o cliente com o servidor.
 */

var ModuleLogin = function() {
    
	var self;
	var ModuleLogin = function() {};
	var domain = "http://localhost:8081/ApontamentoGeopx-Server/webapi/myresource";
	
	ModuleLogin.prototype = {
		
		/**
		 * Funcao que carrega as infromaçoes da tela
		 */
		init: function(){
			self = this;
			$('#usuario').val(self.RetornarUsuarioWin());
			//$('#usuario').val('marcelly.paula'); //DEBUG
			$('#data').val(self.RetornarData());
			$('#hora').val(self.RetornarHora());
			self.LoadtListActives();
			self.LoadtListProjts();
			self.RecuperarSessao();	
		},
		
		/**
		 * Funcao responsável por validar a sessão do usuario
		 */
		ValidarFuncoes: function(session){
			if(session != null){
				$('#btn-inicio').hide();
				$('#btn-fim').show();
			}else{
				$('#btn-inicio').show();
				$('#btn-fim').hide();
			}
		},
		
		/**
		 * Funcao responsavel por iniciar a sessão do usuario
		 */
		IniciarSessao: function(){
			var url = domain + "/beginSassion";
			
			$.post(url,{
				User_Name: self.RetornarUsuarioWin(),
				Id_Atividade:$( "#Atividade option:selected" ).attr("value"),
				Atividade:$("#Atividade option:selected" ).text(),
				Id_Projeto: $("#Projeto option:selected" ).attr("value"),
				Projeto:$("#Projeto option:selected" ).text(),
				DataSys_Inicio: self.RetornarData(),
				HoraSys_Inicio: self.RetornarHora(),
				Status:"Inicio",
				Sub_atividade:"",
			},
			function(data,status){
				if(data){
					alert('Atividade iniciada com sucesso!');
				}
		   				      
			});
		},

		/**
		 * Funcao responsavel por encerrar a sessao do usuario
		 */
		EncerrarSessao: function(){
			var url = domain + "/closeSassion";
			//DEBUG
			//alert('ID_Atividade: ' + $( "#Atividade option:selected" ).attr("value") + ' / ID_Projeto: ' + $("#Projeto option:selected" ).attr("value"));
			$.post(url,{
				User_Name: self.RetornarUsuarioWin(),
				Id_Atividade:$( "#Atividade option:selected" ).attr("value"),
				Atividade:$("#Atividade option:selected" ).text(),
				Id_Projeto: $("#Projeto option:selected" ).attr("value"),
				Projeto:$("#Projeto option:selected" ).text(),
				DataSys_Fim: self.RetornarData(),
				HoraSys_Fim: self.RetornarHora(),
				Status:"Fim",
				Sub_atividade:"",
			},
			function(data,status){
				if(data){
					alert('Atividade encerrada com sucesso!');
				}		      
			});
		},
		
		/**
		 * Funcao Responsável por recuperar a ultima sessao aberta pelo usuário.
		 */
		RecuperarSessao : function() {
			var url = domain + "/getLastSassionByUser?user=" + $('#usuario').val();
			
			$.ajax({
				url : url,
				type : 'get',
				async : true,
				success : function(data) {
					if (data) {
						$("#hora").val(data[0].HoraSys_Inicio);
						$("#data").val(data[0].DataSys_Inicio);
						$("#sub_atividade").text(data[0].Sub_atividade);
						$('#Atividade').prop('value', data[0].Id_Atividade);
						$('#Projeto').prop('value', data[0].Id_Projeto);
						
						self.ValidarFuncoes(data);
						
						alert('Você possui uma atividade em aberta!');
						
						//DEBUG
						//alert('ID_Atividade: ' + $( "#Atividade option:selected" ).attr("value") + ' / ID_Projeto: ' + $("#Projeto option:selected" ).attr("value"));
					}else{
						self.ValidarFuncoes();
					}
				},
				error: function(err, data){
					self.ValidarFuncoes();
				}
			});
		},
		/**
		 * Funcao responsavel por carregar as informaçoes do banco de dados
		 * para o comobobox
		 */
		LoadtListActives : function() {
			var url = domain + "/getListActivites";
	
			$.ajax({
				url : url,
				type : 'get',
				async : true,
				success : function(data) {
					for (var int = 0; int < data.length; int++) {
						$('#Atividade')
			              .append($("<option></option>")
			              .attr("value",data[int].Id_Atividade)
			              .text(data[int].Atividade)); 
					}
				}
			});
		},
				
		/**
		 * Funcao responsavel por carregar as informaçoes do banco de dados
		 * para o comobobox
		 */
		LoadtListProjts : function() {
			var url = domain + "/getListProjets";
			
			$.ajax({
				url : url,
				type : 'get',
				async : true,
				success : function(data) {
					for (var int = 0; int < data.length; int++) {
						$('#Projeto')
			              .append($("<option></option>")
			              .attr("value",data[int].Id_Projeto)
			              .text(data[int].Projeto)); 
					}
				}
			});
		},
		
		/**
		 * Funcao responsavel por coletar o 
		 * usuario do sistema
		 * @returns
		 */	
		
		RetornarUsuarioWin: function(){
			var objNet = new ActiveXObject("WScript.NetWork");
			var strUser_Name = objNet.User_Name;
			var strDomain = objNet.UserDomain;
			
			return objNet.UserName;
		},
			
		/**
		 * Funcao responsavel por coletar a data atual do sistema
		 */
		RetornarData: function(){
			now = new Date();
			num_dia = now.getDate();
			dia = now.getDay();
			mes = now.getMonth();
			ano = now. getFullYear();

			diaSemana = new Array("Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado");
			nomeMes = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");
			dataext = diaSemana[dia] + ", " + num_dia + " de " + nomeMes[mes] + " de " + ano;
			
			return dataext;
		},
			
		/**
		 * Funcao responsavel por coletar a hora atual do sistema
		 * @returns {String}
		 */
		RetornarHora: function(){
			momentoActual = new Date()
			hora = momentoActual.getHours()
			minuto = momentoActual.getMinutes()
			segundo = momentoActual.getSeconds()

			str_segundo = new String (segundo)
			if (str_segundo.length == 1) 
				segundo = "0" + segundo
				
			str_minuto = new String (minuto)
			if (str_minuto.length == 1) 
				minuto = "0" + minuto

			str_hora = new String (hora)
			if (str_hora.length == 1) 
				hora = "0" + hora
				
			return  hora + ":" + minuto + ":" + segundo;
		}
	};
	return ModuleLogin;
}();

var modlogin = new ModuleLogin();
modlogin.init();		