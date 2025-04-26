import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 pt-12 pb-8 mt-auto">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Best Choices */}
                    <div>
                        <h3 className="font-weight font-bold text-lg mb-4">BEST CHOICES</h3>
                        <ul className="space-y-2">
                            <a className=" text-gray-400  font-semibold hover:underline" href="/tour/golden-bridge-ba-na-hills-full-day-tour">Banahill</a>
                            <br></br>
                            <a className=" text-gray-400  font-semibold hover:underline" href="/tour/3-days-ha-giang-loop-motorbike-tour">Ha Giang Loop</a>
                            <br></br>
                            <a className="text-gray-400  font-semibold hover:underline" href="/tour/saphire-cruise-2d1n-ha-long-bay-lan-ha-bay">Ha Long Bay Cruises</a>
                        </ul>
                    </div>
                    {/* Our Office */}
                    <div><h3 className="font-weight font-bold text-lg mb-4">OUR OFFICE</h3>
                        <ul className="flex flex-col gap-5"><li><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/Chung+c%C6%B0+C1+Th%C3%A0nh+C%C3%B4ng/data=!4m2!3m1!1s0x0:0x362b6c24f51d311b?sa=X&amp;ved=1t:2428&amp;ictx=111">
                            <div className="flex gap-2 flex-col !gap-0">
                                <div className="text-gray-400  font-semibold text-[14px]">Hanoi::</div>
                                <div className="text-gray-600  font-semibold ">C1 Building, Thanh Cong, Ba Dinh, Hanoi, Vietnam</div></div></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/28+Nguy%E1%BB%85n+%C4%90%E1%BB%A9c+Trung,+Thanh+Kh%C3%AA+%C4%90%C3%B4ng,+Thanh+Kh%C3%AA,+%C4%90%C3%A0+N%E1%BA%B5ng,+Vietnam/@16.0676787,108.1843914,17z/data=!3m1!4b1!4m6!3m5!1s0x314218fefd05dcdd:0xb79fb38511698a30!8m2!3d16.0676787!4d108.1869663!16s%2Fg%2F11f2cm41z9?entry=ttu&amp;g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D">
                                    <div className="flex gap-2 flex-col !gap-0">
                                        <div className="text-gray-400  font-semibold text-[14px]">Danang::</div>
                                        <div className="text-gray-600  font-semibold">No. 28, Nguyen Duc Trung Street, Thanh Khe District, Danang City</div></div></a></li><li><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/290%2F26+%C4%90.+Nam+K%E1%BB%B3+Kh%E1%BB%9Fi+Ngh%C4%A9a,+Ph%C6%B0%E1%BB%9Dng+8,+Qu%E1%BA%ADn+3,+H%E1%BB%93+Ch%C3%AD+Minh,+Vietnam/@10.7904778,106.6818965,17z/data=!3m1!4b1!4m6!3m5!1s0x317528d32fb7f957:0x70510b2fd4d515b1!8m2!3d10.7904778!4d106.6844714!16s%2Fg%2F11j0sstqpd?entry=ttu&amp;g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D">
                                            <div className="flex gap-2 flex-col !gap-0">
                                                <div className="text-gray-400  font-semibold text-[14px]">Ho Chi Minh city::</div>
                                                <div className="text-gray-600  font-semibold">No. 290/26, Nam kỳ khởi nghĩa Street, District 3, Ho Chi Minh City</div></div></a></li></ul></div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-weight font-bold  text-lg mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-gray-400 font-semibold text-[14px] mr-2">Whatsapp:</span>
                                <div>
                                    <p className="text-gray-600 font-semibold text-[14px]">+84 97 266 49 31 (Grace)</p>
                                    <p className="text-gray-600 font-semibold text-[14px]">+84 90 624 49 14 (Sunny)</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-400 font-semibold hover:underline mr-2">Email:</span>
                                <p className="text-gray-600 font-semibold">vn.meetup.travel@gmail.com</p>
                            </li>
                        </ul>

                        <h3 className="font-weight font-bold  text-lg mb-4 pt-8 ">SOCIAL</h3>
                        <div className="flex space-x-2">
                            <a
                                href="https://www.instagram.com/meetup_vietnam/#"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="https://meetup.travel/_next/static/media/instagram.3296c647.svg"
                                    alt="Instagram"
                                    className="bg-gradient-to-r bg-gray-200 text-white p-2 rounded-lg hover:opacity-90"
                                />
                            </a>

                            <a
                                href="https://www.facebook.com/meetuptravelvn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="https://meetup.travel/_next/static/media/facebook.60aa17bd.svg"
                                    alt="Facebook"
                                    className="bg-gradient-to-r bg-gray-200 text-white p-2 rounded-lg hover:opacity-90"
                                />
                            </a>

                            <a
                                href="https://www.tiktok.com/@meetupvietnam"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="https://meetup.travel/_next/static/media/tiktok.9b93d39d.svg"
                                    alt="Tiktok"
                                    className="bg-gradient-to-r bg-gray-200 text-white p-2 rounded-lg hover:opacity-90"
                                />
                            </a>
                        </div>
                    </div>

                    {/* App Download */}
                    <div>
                        <h3 className="font-weight font-bold text-lg mb-4">DOWNLOAD THE APPLICATION</h3>
                        <div className="flex flex-col space-y-4">
                            <a href="https://play.google.com/store/apps/details?id=com.meetuptravel&hl=vi&gl=US&pli=1" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://meetup.travel/_next/static/media/google-play.dba83062.png"
                                    alt="Google Play"
                                    className="h-14"
                                />
                            </a>
                            <a href="https://apps.apple.com/vn/app/meetup-travel/id6503301743" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://meetup.travel/_next/static/media/app-store.c785571a.png"
                                    alt="App Store"
                                    className="h-14"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Social media icons */}
                <div className="fixed bottom-24 right-8 flex flex-col space-y-2">
                    <a
                        href="https://api.whatsapp.com/send?phone=84972664931"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-teal-500 text-white p-2 rounded-xl "
                    >
                        {FaWhatsapp({ className: "text-2xl" })}
                    </a>
                    <a
                        href="https://www.instagram.com/meetup_vietnam/#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r bg-teal-500 text-white p-2 rounded-xl hover:opacity-90"
                    >
                        {FaInstagram({ className: "text-2xl" })}
                    </a>
                </div>
            </div>

        </footer>
    );
};

export default Footer; 