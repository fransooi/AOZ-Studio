var actor_behaviors = 
{

    //
    // JUMP
    // Description: Donne un comportement de saut à un Actor
    // Paramètres:
    // controls: Par défaut : barre espace, bouton gauche de la souris et premier bouton de la première manette de jeu
    // energy: Entier pour la puissance du saut (25 par défaut)
    // gravity: Flottant pour la force de gravité
    //
	jump: function()
	{
		this.state = 0;
		this.key = undefined;
		this.parameters  =
		{
            public: 
            {
                controls: "space;mouseleft;joybutton0(0)",
			    energy: 25,
                gravity: 1.0
            },

            private:
            {
			    v: undefined,
                y: undefined
            }
		};

		this.render = function( actor )
		{
			var self = this;
			var bob = application.aoz.currentScreen.getBob( actor.Id );
			if( self.state == 1 )
			{
				
				if( self.parameters.private.v == undefined )
				{
					self.parameters.private.v = self.parameters.public.energy;
					self.parameters.private.y = actor.Y;
				}

				var actName = ( !isNaN( actor.Id ) ) ? 'act_' + actor.Id : actor.Id;
				actor.Y = actor.Y - self.parameters.private.v;
				bob.vars.y = actor.Y;
				self.parameters.private.v = self.parameters.private.v - self.parameters.public.gravity;
				if( actor.Y > self.parameters.private.y - 1 )
				{
					actor.Y = self.parameters.private.y;
					bob.vars.y = actor.Y;
					self.state = 0;
					self.parameters.private.v = undefined;
					self.parameters.private.y = undefined;
					self.key = undefined;
				}
				actor_module.bobParams[ actName ] = actor;
				bob.updateCollisionData();
				bob.toUpdateCollisions = true;
				bob.update( { force: true } );
			}
		}
	},

    //
    // FLY
    // Description: Donne un comportement de vol comme Magic Fly. L'Actor affecté s'envole vers le haut lors de l'appui du control, et la gravité l'attire vers le bas
    // Paramètres:
    // controls: Par défaut : barre espace, bouton gauche de la souris et premier bouton de la première manette de jeu
    // energy: Entier pour la puissance de l'envol (15 par défaut)
    // gravity: Flottant pour la force de gravité (5.0 par défaut)
    //
    fly: function()
    {
		this.state = 0;
		this.key = undefined;
		this.parameters  =
		{
            public: 
            {
                controls: "space;mouseleft;joybutton0(0)",
			    energy: 15,
                gravity: 5.0
            },

            private:
            {
			    v: undefined,
                y: undefined
            }
		};

        this.auto = function( actor )
        {
			var self = this;
			var bob = application.aoz.currentScreen.getBob( actor.Id );
            actor.Y = actor.Y + self.parameters.public.gravity;
            bob.vars.y = actor.Y;
            var actName = ( !isNaN( actor.Id ) ) ? 'act_' + actor.Id : actor.Id;
            actor_module.bobParams[ actName ] = actor;
            bob.updateCollisionData();
            bob.toUpdateCollisions = true;
            bob.update( { force: true } );                       
        },

		this.render = function( actor )
		{
			var self = this;
			var bob = application.aoz.currentScreen.getBob( actor.Id );
			if( self.state == 1 )
			{
				var actName = ( !isNaN( actor.Id ) ) ? 'act_' + actor.Id : actor.Id;
				actor.Y = actor.Y - self.parameters.public.energy;
				bob.vars.y = actor.Y;
                self.state = 0;
                self.key = undefined;
                actor_module.bobParams[ actName ] = actor;
				bob.updateCollisionData();
				bob.toUpdateCollisions = true;
				bob.update( { force: true } );
			}
		}
    },

	tank: function()
    {
		this.state = 0;
		this.key = undefined;
		this.parameters  =
		{
            public: 
            {
                controls: "arrowleft;arrowright;arrowup;arrowdown;joyleft0;joyright0;joyup0;joydown0",
			    speed: 4,
                rotation: 4.0
            },

            private:
            {
			    v: undefined,
                y: undefined
            }
		};

		this.render = function( actor )
		{
			var self = this;
			var bob = application.aoz.currentScreen.getBob( actor.Id );
			if( self.state == 1 )
			{
				var actName = ( !isNaN( actor.Id ) ) ? 'act_' + actor.Id : actor.Id;
				if( this.key )
				{
					console.log( this.key );
					if( this.key == 'arrowleft' || this.key == 'joyleft0' )
					{
						actor.Angle = actor.Angle - this.parameters.public.rotation;
						if( actor.Angle < 0 )
						{
							actor.Angle = 359;
						}
					}

					if( this.key == 'arrowright' || this.key == 'joyright0' )
					{
						actor.Angle = actor.Angle +  this.parameters.public.rotation;
						if( actor.Angle > 359 )
						{
							actor.Angle = 0;
						}
					}

					if( this.key == 'arrowup' || this.key == 'joyup0' )
					{
						actor.X = actor.X + Math.cos( actor.Angle * ( Math.PI / 180 ) ) * this.parameters.public.speed;
						actor.Y = actor.Y + Math.sin( actor.Angle * ( Math.PI / 180 ) ) * this.parameters.public.speed;
					}

					if( this.key == 'arrowdown' || this.key == 'joydown0' )
					{
						actor.X = actor.X + Math.cos( actor.Angle * ( Math.PI / 180 ) ) * ( -1 * this.parameters.public.speed );
						actor.Y = actor.Y + Math.sin( actor.Angle * ( Math.PI / 180 ) ) * ( -1 * this.parameters.public.speed );
					}
				}
				bob.vars.x = actor.X;
				bob.vars.y = actor.Y;
				bob.vars.angle = parseFloat( actor.Angle * ( Math.PI / 180 ) );
                self.state = 0;
                self.key = undefined;
                actor_module.bobParams[ actName ] = actor;
				bob.updateCollisionData();
				bob.toUpdateCollisions = true;
				bob.update( { force: true } );
			}
		}
	}
	
}