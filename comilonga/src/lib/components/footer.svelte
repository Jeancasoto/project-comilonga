<script>
	//@ts-nocheck
	import { generals } from '$lib/stores/generals';

	import 'iconify-icon';
	$: logoSRC = $generals['imagen'];
	$: redes_sociales = $generals['redes_sociales'] ?? {
		facebook_link: '',
		instagram_link: '',
		whatsapp_link: '',
		email: ''
	};
	$: facebookURL = redes_sociales['facebook_link'];
	$: instagramURL = redes_sociales['instagram_link'];
	$: whatsappNumber = redes_sociales['whatsapp_link'];
	$: email = redes_sociales['email'];
</script>

<footer class="p-10 bg-white text-neutral">
	<div class="flex flex-row gap-4 items-center">
		<img src={logoSRC} alt="La comilonga logo" class="w-1/2 md:w-1/6" />
		<div class="flex flex-col gap-4">
			<p>
				Todos los derechos reservados {new Date().getFullYear()} ©
			</p>
			<div class="">
				<div>
					<span class="footer-title">Social</span>
				</div>
				<div class="flex flex-row">
					<a href={facebookURL} class="w-fit">
						<iconify-icon icon="mdi:facebook" class="text-2xl" />
					</a>
					<a href={instagramURL} class="w-fit">
						<iconify-icon icon="mdi:instagram" class="text-2xl" />
					</a>
					<a href={`https://wa.me/504${whatsappNumber}`} class="w-fit">
						<iconify-icon icon="mdi:whatsapp" class="text-2xl" />
					</a>
					<a href={`mailto:${email}`} class="w-fit">
						<iconify-icon icon="mdi:email-outline" class="text-2xl" />
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>
