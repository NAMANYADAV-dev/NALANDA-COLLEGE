import { Section } from '@/components/ui/Section';
import { Icon } from '@/components/ui/Icon';
import { TRUST_ITEMS } from '@/features/home/data';

/** TrustBand — dark "Why choose Nalanda" band with four value props. */
export function TrustBand() {
  return (
    <Section tone="band">
      <h2 className="mb-10 text-center font-head text-2xl font-semibold text-white sm:text-[28px]">
        Why choose Nalanda
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <Icon name={item.icon} size={26} />
            </div>
            <h3 className="mb-1.5 font-head text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm leading-relaxed text-[#9fb0c9]">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
