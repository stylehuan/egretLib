class SystemCenter{
		/**
		 * 数据中心系统 
		 */		
		public static playSystem:PlayerSystem;

		private static _kernel:any;
		
		public static setup(value:any):void{
			SystemCenter._kernel = value;
			SystemCenter.init();
		}
		private static init():void{
			
		}
}