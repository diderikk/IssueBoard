module Mutations
	class Edit::EditGroup < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "EditGroup"

		argument :attributes, Types::Input::GroupInputType, required: true
		argument :group_id, ID, required: true, loads: Group

		field :group, Types::GroupType, null: true
		field :errors, [String], null: true

		def resolve(attributes:, group:)
			(raise GraphQL::ExecutionError.new "No group with that id") if group.nil?

			if group.update(name: attributes.name)
				{
					group: group,
					errors: nil,
				}
			else
				{
					group: nil,
					errors: group.errors.full_messages,
				}
			end
		end

		def load_group(id)
  			Group.find(id)
		end

		private

		def authorized?(attributes:, group:)
			group_authorized?(group, nil, context);
		end
	end
end