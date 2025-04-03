import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: any = [
    {
        section: 'Settings',
        items: [
            {
                title: 'Profile',
                url: '/settings/profile',
                icon: null,
            },
            {
                title: 'Password',
                url: '/settings/password',
                icon: null,
            },
            {
                title: 'Appearance',
                url: '/settings/appearance',
                icon: null,
            }
        ]
    },
    {
        section: 'Billing',
        items: [
            {
                title: 'Subscriptions',
                url: '/settings/subscriptions',
                icon: null,
            },
            {
                title: 'Invoices',
                url: '/settings/invoices',
                icon: null,
            }
        ]
    }
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />
            <div className="flex flex-col lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-lg lg:w-48">
                    <nav className="flex flex-col space-y-4">
                        {sidebarNavItems.map((section) => (
                            <div key={section.section}>
                                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                                    {section.section}
                                </h3>
                                <div className="flex flex-col space-y-1">
                                    {section.items.map((item) => (
                                        <Button
                                            key={item.url}
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn('w-full justify-start', {
                                                'bg-muted': currentPath === item.url,
                                            })}
                                        >
                                            <Link href={item.url} prefetch>
                                                {item.title}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1">
                    <section className="w-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
