import { Image, paymentMethods } from "../Shared";

export default function PaymentMethods() {
  return (
    <div className="border-t border-gray-800 mt-12 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Payment Methods */}
        <div>
          <h4 className="text-sm font-semibold mb-4 text-gray-400 uppercase tracking-wide">
            We Accept
          </h4>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method) => (
              <Image
                key={method.name}
                src={method.logo}
                alt={method.name}
                width={80}
                height={60}
                className="h-10"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
