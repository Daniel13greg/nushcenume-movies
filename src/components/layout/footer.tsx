"use client";

import Link from 'next/link';
import { Clapperboard, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    browse: [
      { label: 'Home', href: '/' },
      { label: 'Movies', href: '/movies' },
      { label: 'TV Shows', href: '/shows' },
      { label: 'My Watchlist', href: '/watchlist' },
    ],
    discover: [
      { label: 'Popular', href: '/movies' },
      { label: 'Top Rated', href: '/shows' },
      { label: 'Search', href: '/search' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' },
  ];

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <Clapperboard className="h-6 w-6 text-primary transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-12" />
              <span className="font-bold text-xl">NushCeNume</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your ultimate destination for discovering and tracking movies and TV shows. Explore thousands of titles and build your perfect watchlist.
            </p>
          </motion.div>

          {/* Browse Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Browse</h3>
            <ul className="space-y-3">
              {footerLinks.browse.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.05, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 ease-out inline-block hover:translate-x-2"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Discover Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Discover</h3>
            <ul className="space-y-3">
              {footerLinks.discover.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 + index * 0.05, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 ease-out inline-block hover:translate-x-2"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.35 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ scale: 1.15, y: -4, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300 ease-out"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              Stay updated with the latest releases and updates.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 pt-8 border-t border-border/40"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} NushCeNume. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> using Next.js & TMDB API
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}